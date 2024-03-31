/* eslint-disable @typescript-eslint/no-explicit-any */
import sgMail from '@sendgrid/mail';

import config from '@/config';

import type { MailDataRequired } from '@sendgrid/mail';

interface EmailMessage {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

class SendGridMailer {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;

    sgMail.setApiKey(this.apiKey);
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    const msg: any = {
      to: message.to,
      from: this.fromEmail,
      subject: message.subject,
      text: message.text,
      html: message.html,
    };

    try {
      const response = await sgMail.send(msg);
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    } catch (error: any) {
      if (error.response?.body?.errors) {
        console.error('SendGrid API Errors:', error.response.body.errors);
      } else {
        console.error('Failed to send email:', error);
      }
      throw error;
    }
  }
}

// Example of using the SendGridMailer class
const sendGridMailer = new SendGridMailer(config.SENDGRID_API_KEY, config.ADMIN_EMAIL);

export default sendGridMailer;
