// src/modules/partner/partner.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PartnerService {
  private readonly logger = new Logger(PartnerService.name);
  constructor(
    @InjectRepository(Partner) private repo: Repository<Partner>,
    private readonly uploadService: UploadService,
  ) {}

  findActive() {
    return this.repo.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  async create(dto: CreatePartnerDto) {
    const partner = this.repo.create(dto);
    const saved = await this.repo.save(partner);
    if (dto.logo) {
      this.uploadService
        .confirmUpload(dto.logo)
        .catch((err) =>
          this.logger.warn(`Failed to confirm upload: ${dto.logo}`, err),
        );
    }
    return saved;
  }

  async update(id: string, dto: UpdatePartnerDto) {
    const partner = await this.repo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException();

    if (dto.logo && dto.logo !== partner.logo && partner.logoFileId) {
      this.uploadService
        .deleteFile(partner.logoFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old logo: ${partner.logoFileId}`,
            err,
          ),
        );
    }

    Object.assign(partner, dto);
    const saved = await this.repo.save(partner);
    if (dto.logo && dto.logo !== partner.logo && partner.logoFileId) {
      this.uploadService
        .confirmUpload(dto.logo)
        .catch((err) =>
          this.logger.warn(`Failed to confirm upload: ${dto.logo}`, err),
        );
    }
    return saved;
  }

  async toggle(id: string, isActive: boolean) {
    const partner = await this.repo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException();
    await this.repo.update(id, { isActive });
    return { id, isActive };
  }

  async reorder(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map(({ id, order }) => this.repo.update(id, { order })),
    );
    return { message: 'Reordered successfully' };
  }

  async remove(id: string) {
    const partner = await this.repo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException();

    if (partner.logoFileId) {
      this.uploadService
        .deleteFile(partner.logoFileId)
        .catch((err) =>
          this.logger.warn('Failed to delete logo from ImageKit', err),
        );
    }

    await this.repo.remove(partner);
    return { message: 'Deleted successfully' };
  }
}
