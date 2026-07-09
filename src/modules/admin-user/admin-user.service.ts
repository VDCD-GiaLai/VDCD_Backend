import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './entities/admin-user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private repo: Repository<AdminUser>,
  ) {}

  async findAll(dto: PaginationDto & { role?: string }) {
    const { page = 1, limit = 10, role } = dto;
    const qb = this.repo
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.username',
        'u.email',
        'u.role',
        'u.isActive',
        'u.createdAt',
      ]);
    if (role) qb.where('u.role = :role', { role });
    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async create(dto: CreateAdminUserDto) {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email đã tồn tại');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({ ...dto, passwordHash });
    return this.repo.save(user);
  }

  async update(id: string, dto: UpdateAdminUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');
    if (dto.email && dto.email !== user.email) {
      const exists = await this.repo.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email đã tồn tại');
    }
    if (dto.password) {
      (dto as any).passwordHash = await bcrypt.hash(dto.password, 12);
      delete (dto as any).password;
    }
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    await this.repo.remove(user);
    return { message: 'Deleted successfully' };
  }
}
