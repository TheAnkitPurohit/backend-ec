import path from 'node:path';

import chalk from 'chalk';
import { google } from 'googleapis';
import { htmlToText } from 'html-to-text';
import nodemailer from 'nodemailer';
import pug from 'pug';

import config from '@/config';
import emailArgs from '@/config/email';
import EmailTemplate from '@/models/email-template/emailTemplate.model';
import { rootPath } from '@/utils/helper';

import type { EmailService, EmailServiceOptions, EmailSlug } from '@/types/services/email.types';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const {
  EMAIL_MODE,
  EMAIL_NAME,
  EMAIL_FROM,
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
  CLIENT_EMAIL,
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_REFRESH_TOKEN,
} = config;

class Email {
  private readonly from: string;
  private readonly to: EmailService['to'];
  private readonly cc: EmailService['cc'];
  private readonly bcc: EmailService['bcc'];
  private readonly extra: NonNullable<EmailService['extra']>;

  constructor({ to, cc, bcc, extra }: EmailService) {
    this.from = `${EMAIL_NAME} <${EMAIL_FROM}>`;
    this.to = to;
    this.cc = cc;
    this.bcc = bcc;
    this.extra = extra ?? {};
  }

  static async isEmailServiceWorking(): Promise<string> {
    const transport = await Email.newTransport();

    return new Promise(resolve => {
      transport.verify(error => {
        if (error) return void resolve(chalk.red('Email Not Working!!'));
        return void resolve(chalk.cyan('Email Working!!'));
      });
    });
  }

  static async newTransport(): Promise<Transporter<SMTPTransport.SentMessageInfo>> {
    if (EMAIL_MODE === 'google') {
      const url = 'https://developers.google.com/oauthplayground';
      const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, url);
      oAuth2Client.setCredentials({ refresh_token: CLIENT_REFRESH_TOKEN });

      const accessToken = await oAuth2Client.getAccessToken();
      return nodemailer.createTransport({
        // @ts-expect-error nodemailer ts support is low
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: CLIENT_EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: CLIENT_REFRESH_TOKEN,
          accessToken,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587,
      auth: {
        user: MAILTRAP_USERNAME,
        pass: MAILTRAP_PASSWORD,
      },
    });
  }

  static htmlReplacer(html: string, options: EmailServiceOptions): string {
    const { values, extra } = options;
    return values.reduce((acc, cur) => acc.replace(`{{${cur}}}`, extra[cur] ?? ''), html);
  }

  async send(subject: string, options: EmailServiceOptions): Promise<void> {
    let html = pug.renderFile(path.join(rootPath, 'views', 'layout.pug'), {
      content: options.content,
      ...options.extra,
    });
    html = Email.htmlReplacer(html, options);
    const transport = await Email.newTransport();

    await transport.sendMail({
      from: this.from,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject,
      html,
      text: htmlToText(html),
    });
  }

  async sendEmail(slug: EmailSlug): Promise<boolean> {
    const { subject: staticSubject, dynamicValues } = emailArgs[slug];

    const email = await EmailTemplate.findOne({ isActive: true, slug }).select(
      'description values'
    );
    if (!email) return false;

    const { description: content, values } = email;
    // You can pass anything here and access in dynamicValues
    const extra = dynamicValues ? await dynamicValues(this.extra) : {};
    const subject = extra.subject ?? staticSubject;

    await this.send(subject, { content, values, extra });
    return true;
  }
}

export default Email;
