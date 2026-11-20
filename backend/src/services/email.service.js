import { sendMail } from '../utils/mailer.js';

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export class EmailService {
  /**
   * Confirmation to the person who submitted the enquiry.
   * Deliberately does not repeat their message, to keep sensitive details out of inboxes.
   */
  static async sendEnquiryConfirmation({ to, name, service, reference }) {
    const subject = `We've received your enquiry (Ref ${reference}) - Verdict Beach`;
    const text = [
      `Dear ${name},`,
      '',
      'Thank you for contacting Verdict Beach. We have received your enquiry.',
      `Reference: ${reference}`,
      `Service: ${service}`,
      '',
      'A member of our team will review your enquiry and get back to you.',
      'If you need to add information, reply to this email and quote your reference.',
      '',
      'Verdict Beach, a Belvo Ventures Group vertical',
      'This email is general correspondence and does not constitute legal advice.',
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;color:#252B35;line-height:1.6">
        <p>Dear ${escapeHtml(name)},</p>
        <p>Thank you for contacting <strong>Verdict Beach</strong>. We have received your enquiry.</p>
        <p><strong>Reference:</strong> ${escapeHtml(reference)}<br/>
           <strong>Service:</strong> ${escapeHtml(service)}</p>
        <p>A member of our team will review your enquiry and get back to you.
           If you need to add information, reply to this email and quote your reference.</p>
        <hr style="border:none;border-top:1px solid #ddd"/>
        <p style="font-size:12px;color:#666">Verdict Beach, a Belvo Ventures Group vertical.<br/>
           This email is general correspondence and does not constitute legal advice.</p>
      </div>`;

    return sendMail({ to, subject, text, html, replyTo: process.env.NOTIFICATION_EMAIL || undefined });
  }

  /** Internal alert to the Verdict Beach team. */
  static async sendAdminNotification(enquiry) {
    const to = process.env.NOTIFICATION_EMAIL;
    if (!to) {
      console.warn('[Mail] NOTIFICATION_EMAIL not set. Team alert skipped.');
      return { skipped: true };
    }
    const subject = `New enquiry: ${enquiry.service} - ${enquiry.name}`;
    const rows = [
      ['Name', enquiry.name],
      ['Company', enquiry.companyName],
      ['Email', enquiry.email],
      ['Phone', enquiry.phone],
      ['Role', enquiry.role],
      ['Service', enquiry.service],
      ['Attachments', enquiry.attachments?.length ?? 0],
    ]
      .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v ?? '')}</p>`)
      .join('');
    const html = `<h2>${escapeHtml(subject)}</h2>${rows}<p><strong>Message:</strong></p><p>${escapeHtml(enquiry.message).replace(/\n/g, '<br/>')}</p>`;

    return sendMail({ to, subject, html, text: `${subject}\n\n${enquiry.message}`, replyTo: enquiry.email });
  }
}
