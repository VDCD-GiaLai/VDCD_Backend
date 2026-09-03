import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';
import {
  normalizeEmail,
  isDisposableEmail,
  hasMxRecords,
} from '../../common/utils/email-validation.util';
import {
  checkEmailRateLimit,
  recordEmailSend,
} from '../../common/utils/email-rate-limit.util';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact) private repo: Repository<Contact>,
    private mailService: MailService,
    private redisService: RedisService,
  ) {}

  async create(dto: CreateContactDto) {
    // Honeypot: bot điền field website
    if (dto.website)
      return { message: 'Gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!' };

    // ── Email validation ──
    const email = normalizeEmail(dto.email);

    if (isDisposableEmail(email)) {
      throw new BadRequestException({
        success: false,
        code: 'DISPOSABLE_EMAIL',
        message: 'Email tạm thời không được chấp nhận.',
      });
    }

    const hasMx = await hasMxRecords(email);
    if (!hasMx) {
      throw new BadRequestException({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'Địa chỉ email không hợp lệ.',
      });
    }

    // ── Rate limit check ──
    const redis = this.redisService.getClient();
    const { allowed } = await checkEmailRateLimit(redis, email);
    if (!allowed) {
      throw new BadRequestException({
        success: false,
        code: 'EMAIL_RATE_LIMITED',
        message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 24 giờ.',
      });
    }

    // ── Save to DB ──
    const contact = this.repo.create({
      fullName: dto.fullName,
      email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      attachment: dto.attachment,
    });
    await this.repo.save(contact);

    // ── Send email & record rate limit on success ──
    try {
      await this.mailService.sendContactNotification(contact);
      await recordEmailSend(redis, email);
    } catch (err) {
      // Mail failed — don't consume rate-limit slot, still return success for DB save
      this.logger.error('Contact mail error:', err);
    }

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
