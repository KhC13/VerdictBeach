import nodemailer from 'nodemailer';

// Gmail SMTP: host smtp.gmail.com, port 587 (STARTTLS), using a Google App Password.
let transporter = null;

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  if (!isMailConfigured()) {
    console.warn(`[Mail] SMTP not configured. Skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  const info = await getTransporter().sendMail({
    from: `"Verdict Beach" <${process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
  return { messageId: info.messageId };
}
