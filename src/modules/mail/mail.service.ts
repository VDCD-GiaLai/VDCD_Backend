import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Lead } from '../lead/entities/lead.entity';

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
    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: this.config.get('MAIL_ADMIN'),
      subject: `[VDCD] Liên hệ mới từ ${lead.fullName}`,
      html: `
        <h2>Thông tin liên hệ mới</h2>
        <p><strong>Họ tên:</strong> ${lead.fullName}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>SĐT:</strong> ${lead.phone ?? 'Không có'}</p>
        <p><strong>Chủ đề:</strong> ${lead.subject ?? 'Không có'}</p>
        <p><strong>Nội dung:</strong><br>${lead.message ?? 'Không có'}</p>
        <p><strong>Thời gian:</strong> ${lead.createdAt}</p>
        <hr>
        <p><a href="${this.config.get('ADMIN_URL')}/leads/${lead.id}">Xem trong Admin Panel</a></p>
      `,
    });
  }
}
