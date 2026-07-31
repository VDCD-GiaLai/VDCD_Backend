import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private repo: Repository<Contact>,
    private mailService: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    // Honeypot: bot điền field website
    if (dto.website)
      return { message: 'Gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!' };

    const contact = this.repo.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      attachment: dto.attachment,
    });
    await this.repo.save(contact);

    // Gửi email async, không block response
    this.mailService
      .sendContactNotification(contact)
      .catch((err) => console.error('Contact mail error:', err));

    return { message: 'Gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!' };
  }

  async findAll(dto: FilterContactDto) {
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
    const contact = await this.repo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException();
    // Tự động đánh dấu đã đọc
    if (!contact.isRead) await this.repo.update(id, { isRead: true });
    return contact;
  }

  async markRead(id: string, isRead: boolean) {
    await this.repo.update(id, { isRead });
    return { id, isRead };
  }

  async remove(id: string) {
    const contact = await this.repo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException();
    await this.repo.remove(contact);
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
