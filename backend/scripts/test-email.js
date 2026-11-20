// Sends one real email through Gmail SMTP to check the credentials.
//   TEST_EMAIL_TO=you@yourdomain.com npm run test:email
import 'dotenv/config';
import { sendMail, isMailConfigured } from '../src/utils/mailer.js';

const to = process.env.TEST_EMAIL_TO;
if (!isMailConfigured()) {
  console.error('SMTP_USER and SMTP_PASS must be set in .env');
  process.exit(1);
}
if (!to) {
  console.error('Set TEST_EMAIL_TO to the address that should receive the test email.');
  process.exit(1);
}

try {
  const info = await sendMail({
    to,
    subject: 'Verdict Beach: Gmail SMTP test',
    text: 'If you can read this, Gmail SMTP is working for Verdict Beach.',
    html: '<p>If you can read this, Gmail SMTP is working for Verdict Beach.</p>',
  });
  console.log('Sent. Message ID:', info.messageId);
} catch (err) {
  console.error('Gmail send failed:', err.message);
  console.error('Common causes: 2-Step Verification is off, the App Password is wrong or has spaces, or the account is locked.');
  process.exit(1);
}
