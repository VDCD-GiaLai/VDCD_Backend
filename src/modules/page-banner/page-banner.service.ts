// src/modules/page-banner/page-banner.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageBanner } from './entities/page-banner.entity';
import { CreatePageBannerDto } from './dto/create-page-banner.dto';
import { UpdatePageBannerDto } from './dto/update-page-banner.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PageBannerService {
  private readonly logger = new Logger(PageBannerService.name);

  constructor(
    @InjectRepository(PageBanner) private repo: Repository<PageBanner>,
    private readonly uploadService: UploadService,
  ) {}

  async findByPageKey(pageKey: string) {
    const banner = await this.repo.findOne({
      where: { pageKey, isActive: true },
    });
    if (!banner) {
      throw new NotFoundException(`Banner for page '${pageKey}' not found`);
    }
    return banner;
  }

  findAll() {
    return this.repo.find({ order: { pageKey: 'ASC' } });
  }

  async upsert(dto: CreatePageBannerDto) {
    let banner = await this.repo.findOne({ where: { pageKey: dto.pageKey } });
    if (banner) {
      Object.assign(banner, dto);
    } else {
      banner = this.repo.create(dto);
    }

    const saved = await this.repo.save(banner);

    if (dto.imageFileId) {
      this.uploadService
        .confirmUpload(dto.imageFileId)
        .catch((err) =>
          this.logger.warn(`Failed to confirm upload: ${dto.imageFileId}`, err),
        );
    }

    return saved;
  }

  async update(pageKey: string, dto: UpdatePageBannerDto) {
    const banner = await this.repo.findOne({ where: { pageKey } });
    if (!banner) {
      throw new NotFoundException(`Banner for page '${pageKey}' not found`);
    }

    if (
      dto.imageUrl &&
      dto.imageUrl !== banner.imageUrl &&
      banner.imageFileId
    ) {
      this.uploadService
        .deleteFile(banner.imageFileId)
        .catch((err) =>
          this.logger.warn(
            `Failed to delete old banner image: ${banner.imageFileId}`,
            err,
          ),
        );
    }

    Object.assign(banner, dto);
    const saved = await this.repo.save(banner);

    if (dto.imageFileId && dto.imageFileId !== banner.imageFileId) {
      this.uploadService
        .confirmUpload(dto.imageFileId)
        .catch((err) =>
          this.logger.warn(`Failed to confirm upload: ${dto.imageFileId}`, err),
        );
    }

    return saved;
  }

  async remove(id: string) {
    const banner = await this.repo.findOne({ where: { id } });
    if (!banner) throw new NotFoundException();

    if (banner.imageFileId) {
      this.uploadService
        .deleteFile(banner.imageFileId)
        .catch((err) =>
          this.logger.warn(`Failed to delete banner image from ImageKit`, err),
        );
    }

    await this.repo.remove(banner);
    return { message: 'Page banner deleted successfully' };
  }
}
