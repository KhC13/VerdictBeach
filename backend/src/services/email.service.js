export class EmailService {
  /**
   * Sends confirmation email to the client who submitted an enquiry
   */
  static async sendEnquiryConfirmation({ to, name, service }) {
    // In development or when email provider is not yet configured, log notification
    console.log(`[EmailService] Simulated confirmation sent to: ${to} (Client: ${name}, Service: ${service})`);
    return { delivered: true, simulated: true };
  }

  /**
   * Sends alert email to internal Verdict Beach counsel / admin
   */
  static async sendAdminNotification(enquiry) {
    console.log(`[EmailService] New lead alert for team: ${enquiry.name} (${enquiry.email}) requested "${enquiry.service}"`);
    return { delivered: true, simulated: true };
  }
}
