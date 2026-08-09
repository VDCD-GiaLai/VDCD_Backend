import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Tạm thời comment Resend SDK do lỗi trên production, chuyển sang dùng Google SMTP (Nodemailer)
// import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';
import { Lead } from '../lead/entities/lead.entity';
import { Contact } from '../contact/entities/contact.entity';
import { renderLeadNotificationTemplate } from './templates/lead-notification.template';
import { renderContactNotificationTemplate } from './templates/contact-notification.template';
import { renderLeadConfirmationTemplate } from './templates/lead-confirmation.template';
import { renderContactConfirmationTemplate } from './templates/contact-confirmation.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  // private resend?: Resend;
  private transporter?: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    /* Tạm thời comment Resend logic do lỗi production:
    const resendApiKey =
      config.get<string>('RESEND_API_KEY') ||
      (config.get<string>('MAIL_PASSWORD')?.startsWith('re_')
        ? config.get<string>('MAIL_PASSWORD')
        : undefined);

    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.logger.log('MailService initialized with Resend SDK');
    } else
    */
    if (config.get('MAIL_HOST')) {
      this.transporter = nodemailer.createTransport({
        host: config.get('MAIL_HOST'),
        port: config.get<number>('MAIL_PORT', 587),
        secure: config.get('MAIL_SECURE') === 'true',
        auth: {
          user: config.get('MAIL_USER'),
          pass: config.get('MAIL_PASSWORD'),
        },
      });
      this.logger.log('MailService initialized with Nodemailer SMTP (Google)');
    } else {
      this.logger.warn('No mail provider configured (MAIL_HOST missing)');
    }
  }

  private async sendMail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    /* Tạm thời comment Resend logic:
    if (this.resend) {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend error sending email to ${to}: ${error.message}`);
        throw new Error(error.message);
      }
      this.logger.log(`Email sent via Resend to ${to} (id: ${data?.id})`);
    } else
    */
    if (this.transporter) {
      await this.transporter.sendMail({ from, to, subject, html });
      this.logger.log(`Email sent via SMTP to ${to}`);
    } else {
      this.logger.warn(`Mail skipped (no mail provider active) for ${to}`);
    }
  }

  private getFromEmail(): string {
    return (
      this.config.get('MAIL_FROM') ||
      (this.config.get('MAIL_USER')
        ? `VDCD Group <${this.config.get('MAIL_USER')}>`
        : 'VDCD Group <noreply@vdcd.vn>')
    );
  }

  /** Send internal notification for a new recruitment lead & confirmation email to candidate */
  async sendLeadNotification(lead: Lead) {
    const adminUrl = this.config.get('ADMIN_URL') || 'http://localhost:3002';
    const appEnv = this.config.get('NODE_ENV') || 'development';
    const from = this.getFromEmail();
    const adminMail = this.config.get('MAIL_ADMIN');

    // 1. Internal notification to Admin
    if (adminMail) {
      const adminHtml = renderLeadNotificationTemplate(lead, {
        adminUrl,
        appEnv,
      });

      await this.sendMail({
        from,
        to: adminMail,
        subject: `[VDCD Group] Hồ sơ ứng tuyển mới từ ${lead.fullName}`,
        html: adminHtml,
      });
    }

    // 2. Confirmation email to Candidate (User)
    if (lead.email) {
      try {
        const userHtml = renderLeadConfirmationTemplate(lead);
        await this.sendMail({
          from,
          to: lead.email,
          subject: `[VDCD Group] Xác nhận đã nhận hồ sơ ứng tuyển của bạn`,
          html: userHtml,
        });
      } catch (err) {
        this.logger.error(
          `Failed to send applicant confirmation email to ${lead.email}`,
          err,
        );
      }
    }
  }

  /** Send internal notification for a new contact submission & confirmation email to user */
  async sendContactNotification(contact: Contact) {
    const adminUrl = this.config.get('ADMIN_URL') || 'http://localhost:3002';
    const appEnv = this.config.get('NODE_ENV') || 'development';
    const from = this.getFromEmail();
    const adminMail = this.config.get('MAIL_ADMIN');

    // 1. Internal notification to Admin
    if (adminMail) {
      const adminHtml = renderContactNotificationTemplate(contact, {
        adminUrl,
        appEnv,
      });

      await this.sendMail({
        from,
        to: adminMail,
        subject: `[VDCD Group] Yêu cầu liên hệ mới từ ${contact.fullName}`,
        html: adminHtml,
      });
    }

    // 2. Confirmation email to User
    if (contact.email) {
      try {
        const userHtml = renderContactConfirmationTemplate(contact);
        await this.sendMail({
          from,
          to: contact.email,
          subject: `[VDCD Group] Xác nhận đã nhận thông tin liên hệ của bạn`,
          html: userHtml,
        });
      } catch (err) {
        this.logger.error(
          `Failed to send user contact confirmation email to ${contact.email}`,
          err,
        );
      }
    }
  }
}

