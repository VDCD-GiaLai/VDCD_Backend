// src/modules/page-banner/dto/update-page-banner.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePageBannerDto } from './create-page-banner.dto';

export class UpdatePageBannerDto extends PartialType(CreatePageBannerDto) {}
