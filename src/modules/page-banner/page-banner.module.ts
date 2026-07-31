// src/modules/page-banner/page-banner.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageBanner } from './entities/page-banner.entity';
import { PageBannerService } from './page-banner.service';
import { PageBannerController } from './page-banner.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([PageBanner]), UploadModule],
  providers: [PageBannerService],
  controllers: [PageBannerController],
  exports: [PageBannerService],
})
export class PageBannerModule {}
