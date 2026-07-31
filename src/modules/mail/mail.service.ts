import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT', 587),
      secure: config.get('MAIL_SECURE') === 'true',
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
    });
  }

  /** Send internal notification for a new recruitment lead & confirmation email to candidate */
  async sendLeadNotification(lead: Lead) {
    const adminUrl = this.config.get('ADMIN_URL') || 'http://localhost:3002';
    const appEnv = this.config.get('NODE_ENV') || 'development';

    // 1. Internal notification to Admin
    const adminHtml = renderLeadNotificationTemplate(lead, {
      adminUrl,
      appEnv,
    });

    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: this.config.get('MAIL_ADMIN'),
      subject: `[VDCD Group] Hồ sơ ứng tuyển mới từ ${lead.fullName}`,
      html: adminHtml,
    });

    // 2. Confirmation email to Candidate (User)
    if (lead.email) {
      try {
        const userHtml = renderLeadConfirmationTemplate(lead);
        await this.transporter.sendMail({
          from: this.config.get('MAIL_FROM'),
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

    // 1. Internal notification to Admin
    const adminHtml = renderContactNotificationTemplate(contact, {
      adminUrl,
      appEnv,
    });

    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: this.config.get('MAIL_ADMIN'),
      subject: `[VDCD Group] Yêu cầu liên hệ mới từ ${contact.fullName}`,
      html: adminHtml,
    });

    // 2. Confirmation email to User
    if (contact.email) {
      try {
        const userHtml = renderContactConfirmationTemplate(contact);
        await this.transporter.sendMail({
          from: this.config.get('MAIL_FROM'),
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
