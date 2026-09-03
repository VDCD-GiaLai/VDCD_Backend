import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';
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
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    @InjectRepository(Lead) private repo: Repository<Lead>,
    private mailService: MailService,
    private redisService: RedisService,
  ) {}

  async create(dto: CreateLeadDto) {
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

    // ── Save to DB (preserve all existing fields) ──
    const lead = this.repo.create({
      fullName: dto.fullName,
      email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      attachment: dto.attachment,
      dob: dto.dob ? new Date(dto.dob) : undefined,
      address: dto.address,
      experienceYears: dto.experienceYears,
      expectedSalary: dto.expectedSalary,
      portfolioUrl: dto.portfolioUrl,
      coverLetter: dto.coverLetter,
      source: dto.source,
    });
    await this.repo.save(lead);

    // ── Send email & record rate limit on success ──
    try {
      await this.mailService.sendLeadNotification(lead);
      await recordEmailSend(redis, email);
    } catch (err) {
      // Mail failed — don't consume rate-limit slot, still return success for DB save
      this.logger.error('Lead mail error:', err);
    }

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
        source: true,
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
