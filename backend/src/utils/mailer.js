import nodemailer from 'nodemailer';

let transporter;
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (!transporter) transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export async function sendSubmissionNotification(kind, data) {
  const mailer = getTransporter();
  if (!mailer || !process.env.NOTIFICATION_EMAIL) {
    console.warn('Email notification skipped: SMTP is not fully configured');
    return;
  }
  const subject = `New ${kind} received - VERDICT BEACH`;
  const rows = Object.entries(data).map(([key, value]) =>
    `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value ?? '')}</p>`
  ).join('');
  await mailer.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject,
    html: `<h2>${escapeHtml(subject)}</h2>${rows}`
  });
}
