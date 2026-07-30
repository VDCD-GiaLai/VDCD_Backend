import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Lead } from '../lead/entities/lead.entity';
import { renderLeadNotificationTemplate } from './templates/lead-notification.template';

@Injectable()
export class MailService {
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

  async sendLeadNotification(lead: Lead) {
    const adminUrl = this.config.get('ADMIN_URL') || 'http://localhost:3002';
    const appEnv = this.config.get('NODE_ENV') || 'development';

    const htmlContent = renderLeadNotificationTemplate(lead, {
      adminUrl,
      appEnv,
    });

    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: this.config.get('MAIL_ADMIN'),
      subject: `[VDCD Group] Thông tin liên hệ mới từ ${lead.fullName}`,
      html: htmlContent,
    });
  }
}
