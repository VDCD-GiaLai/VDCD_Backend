import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { MailService } from '../mail/mail.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead) private repo: Repository<Lead>,
    private mailService: MailService,
  ) {}

  async create(dto: CreateLeadDto) {
    // Honeypot: bot điền field website
    if (dto.website)
      return { message: 'Gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!' };

    const lead = this.repo.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      attachment: dto.attachment,
    });
    await this.repo.save(lead);

    // Gửi email async, không block response
    this.mailService
      .sendLeadNotification(lead)
      .catch((err) => console.error('Mail error:', err));

    return { message: 'Gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!' };
  }

  async findAll(dto: FilterLeadDto) {
    const { page = 1, limit = 20, isRead } = dto;
    const where: any = {};
    if (isRead !== undefined) where.isRead = isRead;
    const [data, total] = await this.repo.findAndCount({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        subject: true,
        isRead: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const unread = await this.repo.count({ where: { isRead: false } });
    return { data, total, unread, page, limit };
  }

  async findOne(id: string) {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException();
    // Tự động đánh dấu đã đọc
    if (!lead.isRead) await this.repo.update(id, { isRead: true });
    return lead;
  }

  async markRead(id: string, isRead: boolean) {
    await this.repo.update(id, { isRead });
    return { id, isRead };
  }

  async remove(id: string) {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException();
    await this.repo.remove(lead);
    return { message: 'Deleted successfully' };
  }

  async exportCsv(from?: string, to?: string) {
    const where: any = {};
    if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to));
    }
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }
}
