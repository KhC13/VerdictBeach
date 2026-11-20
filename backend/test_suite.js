// Backend verification suite. Needs a running server and an existing admin account.
//
// 1. Create the admin once (per environment):
//    ADMIN_NAME="Eleanor Vance" ADMIN_EMAIL=admin@yourdomain.com ADMIN_PASSWORD='a-long-password-here' npm run create-admin
// 2. Start the server:  npm run dev
// 3. Run the checks:    ADMIN_EMAIL=admin@yourdomain.com ADMIN_PASSWORD='...' TEST_EMAIL_TO=you@yourdomain.com npm test
//
// TEST_EMAIL_TO receives the client confirmation email, so use an inbox you can check.

import fs from 'fs';
import os from 'os';
import path from 'path';

const API = (process.env.API_BASE || 'http://localhost:5000/api').replace(/\/$/, '');
const ORIGIN = API.replace(/\/api$/, '');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const TEST_EMAIL_TO = process.env.TEST_EMAIL_TO || 'qa-test@example.com';

let passed = 0;
let failed = 0;
function check(label, ok, detail = '') {
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${!ok && detail ? `  (${detail})` : ''}`);
}

async function call(method, url, { token, json, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let body;
  if (json) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  }
  if (form) body = form;
  const res = await fetch(url, { method, headers, body });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

const validEnquiry = (extra = {}) => ({
  name: 'Sophia Sterling',
  companyName: 'Nova Robotics Corp',
  email: TEST_EMAIL_TO,
  phone: '+1 650 492 8812',
  role: 'Startup Founder',
  service: 'Startup Legal Support',
  message: 'Automated verification test enquiry. Please ignore.',
  ...extra,
});

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (the account created with npm run create-admin).');
    process.exit(1);
  }
  console.log(`=== Verdict Beach backend checks: ${API} ===\n`);

  // Health
  const health = await call('GET', `${API}/health`);
  check('API is reachable', health.status === 200 || health.status === 503, `status ${health.status}`);
  check('Database is connected', health.status === 200, 'health reports database unavailable');

  // Public registration is closed
  const reg = await call('POST', `${API}/auth/register`, {
    json: { name: 'Intruder Test', email: `intruder${Date.now()}@example.com`, password: 'a-long-password-123' },
  });
  check('Public registration is refused', reg.status === 401, `status ${reg.status}`);

  // Login
  const badLogin = await call('POST', `${API}/auth/login`, { json: { email: ADMIN_EMAIL, password: 'wrong-password-123' } });
  check('Wrong password is rejected', badLogin.status === 401, `status ${badLogin.status}`);

  const login = await call('POST', `${API}/auth/login`, { json: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } });
  const token = login.data?.data?.token;
  check('Admin login returns a token', login.status === 200 && !!token, `status ${login.status}`);

  // Protected routes
  const me = await call('GET', `${API}/auth/me`, { token });
  check('GET /auth/me works with a token', me.status === 200, `status ${me.status}`);
  const anonList = await call('GET', `${API}/enquiries`);
  check('GET /enquiries needs a token', anonList.status === 401, `status ${anonList.status}`);
  const forged = await call('GET', `${API}/enquiries`, { token: 'not.a.real.token' });
  check('A forged token is rejected', forged.status === 401, `status ${forged.status}`);
  const list = await call('GET', `${API}/enquiries?page=1&limit=5`, { token });
  check('GET /enquiries works with a token', list.status === 200, `status ${list.status}`);

  // Public enquiry validation and spam protection
  const invalid = await call('POST', `${API}/enquiries`, { json: { name: 'A' } });
  check('Invalid enquiry returns field errors', invalid.status === 400 && Array.isArray(invalid.data?.errors), `status ${invalid.status}`);

  const honeypot = await call('POST', `${API}/enquiries`, { json: validEnquiry({ website: 'http://spam.example' }) });
  check('Honeypot submission gets a fake success and stores nothing', honeypot.status === 201 && honeypot.data?.data?.id === null, `status ${honeypot.status}`);

  // Real enquiry with an attachment (triggers the confirmation email)
  const tmp = path.join(os.tmpdir(), `vb-test-${Date.now()}.txt`);
  fs.writeFileSync(tmp, 'Test attachment for the Verdict Beach verification suite.');
  const form = new FormData();
  for (const [key, value] of Object.entries(validEnquiry())) form.append(key, value);
  form.append('attachments', new Blob([fs.readFileSync(tmp)], { type: 'text/plain' }), 'test-attachment.txt');
  const created = await call('POST', `${API}/enquiries`, { form });
  fs.unlinkSync(tmp);
  const id = created.data?.data?.id;
  check('Enquiry with attachment is accepted', created.status === 201 && !!id, `status ${created.status}, ${created.data?.message}`);

  if (id) {
    const anon = await call('GET', `${API}/enquiries/${id}/attachments/0`);
    check('Attachment download is refused without a token', anon.status === 401, `status ${anon.status}`);

    const staff = await fetch(`${API}/enquiries/${id}/attachments/0`, { headers: { Authorization: `Bearer ${token}` } });
    const text = await staff.text();
    check('Attachment download works with a token', staff.status === 200 && text.includes('Test attachment'), `status ${staff.status}`);
  }

  const publicFile = await fetch(`${ORIGIN}/uploads/documents/anything.txt`);
  check('Uploaded documents are not publicly served', publicFile.status === 404, `status ${publicFile.status}`);

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  console.log(`Confirmation email: check ${TEST_EMAIL_TO} and the team inbox. Server logs show "[Mail]" lines if SMTP is skipped or failing.`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error('Test suite could not run. Is the server running?', err.message);
  process.exit(1);
});
