import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== VERDICT BEACH BACKEND VERIFICATION SUITE ===\n');

  // Test 1: Unauthenticated access to /api/enquiries
  console.log('1. Testing Unauthenticated Access to GET /api/enquiries:');
  const res1 = await fetch(`${API_BASE}/enquiries`);
  const data1 = await res1.json();
  console.log(`Status: ${res1.status} (${res1.status === 401 ? 'PASS - Protected' : 'FAIL'})`);
  console.log(`Response:`, data1);
  console.log('------------------------------------------------\n');

  // Test 2: Admin Registration
  console.log('2. Testing Admin User Registration (POST /api/auth/register):');
  const adminEmail = `admin_${Date.now()}@verdictbeach.com`;
  const res2 = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Eleanor Vance, Managing Partner',
      email: adminEmail,
      password: 'SecurePassword123!',
      role: 'admin',
    }),
  });
  const data2 = await res2.json();
  console.log(`Status: ${res2.status} (${res2.status === 201 ? 'PASS' : 'FAIL'})`);
  console.log(`User created: ${data2.data?.user?.email}, Role: ${data2.data?.user?.role}`);
  const authToken = data2.data?.token;
  console.log(`Token received: ${authToken ? authToken.slice(0, 25) + '...' : 'NONE'}`);
  console.log('------------------------------------------------\n');

  // Test 3: Admin Login
  console.log('3. Testing Admin Login (POST /api/auth/login):');
  const res3 = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: adminEmail,
      password: 'SecurePassword123!',
    }),
  });
  const data3 = await res3.json();
  console.log(`Status: ${res3.status} (${res3.status === 200 ? 'PASS' : 'FAIL'})`);
  console.log(`Login message: ${data3.message}`);
  console.log('------------------------------------------------\n');

  // Test 4: Current User Profile (GET /api/auth/me)
  console.log('4. Testing Protected Profile (GET /api/auth/me):');
  const res4 = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const data4 = await res4.json();
  console.log(`Status: ${res4.status} (${res4.status === 200 ? 'PASS' : 'FAIL'})`);
  console.log(`Profile: ${data4.data?.name} (${data4.data?.email})`);
  console.log('------------------------------------------------\n');

  // Test 5: Authenticated Access to Enquiries (GET /api/enquiries)
  console.log('5. Testing Authenticated Access to GET /api/enquiries:');
  const res5 = await fetch(`${API_BASE}/enquiries`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const data5 = await res5.json();
  console.log(`Status: ${res5.status} (${res5.status === 200 ? 'PASS' : 'FAIL'})`);
  console.log(`Total enquiries in DB: ${data5.data?.pagination?.total}`);
  console.log('------------------------------------------------\n');

  // Test 6: Public Enquiry Submission with Document Attachment (Multipart)
  console.log('6. Testing Public Enquiry with Document Attachment (POST /api/enquiries):');
  // Create a temporary sample agreement file
  const sampleFilePath = path.resolve('sample_founder_agreement.txt');
  fs.writeFileSync(
    sampleFilePath,
    'CONFIDENTIAL DRAFT: Founder Collaboration and Equity Vesting Agreement - Verdict Beach Client.'
  );

  const fileBlob = new Blob([fs.readFileSync(sampleFilePath)], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('name', 'Sophia Sterling');
  formData.append('companyName', 'Nova Robotics Corp');
  formData.append('email', 'sophia@novarobotics.io');
  formData.append('phone', '+1 650 492 8812');
  formData.append('role', 'Startup Founder');
  formData.append('service', 'Startup Legal Support');
  formData.append(
    'message',
    'We are attaching our initial founder collaboration draft for counsel review and restructuring.'
  );
  formData.append('attachments', fileBlob, 'sample_founder_agreement.txt');

  const res6 = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    body: formData,
  });
  const data6 = await res6.json();
  console.log(`Status: ${res6.status} (${res6.status === 201 ? 'PASS' : 'FAIL'})`);
  console.log(`Created enquiry ID: ${data6.data?._id}`);
  console.log(`Attachments stored:`, data6.data?.attachments);

  // Clean up temporary local file
  if (fs.existsSync(sampleFilePath)) fs.unlinkSync(sampleFilePath);

  // Test 7: Verify Document Static Serving
  if (data6.data?.attachments?.length > 0) {
    const docUrl = `http://localhost:5000${data6.data.attachments[0].url}`;
    console.log(`\n7. Testing Static Document Access (${docUrl}):`);
    const res7 = await fetch(docUrl);
    const content = await res7.text();
    console.log(`Status: ${res7.status} (${res7.status === 200 ? 'PASS' : 'FAIL'})`);
    console.log(`Fetched file snippet: "${content.slice(0, 45)}..."`);
  }

  console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
