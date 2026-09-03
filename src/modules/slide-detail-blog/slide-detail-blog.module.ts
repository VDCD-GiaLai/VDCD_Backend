// src/modules/slide-detail-blog/slide-detail-blog.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideDetailBlog } from './entities/slide-detail-blog.entity';
import { Slide } from '../slide/entities/slide.entity';
import { SlideDetailBlogService } from './slide-detail-blog.service';
import { SlideDetailBlogController } from './slide-detail-blog.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([SlideDetailBlog, Slide]), UploadModule],
  providers: [SlideDetailBlogService],
  controllers: [SlideDetailBlogController],
  exports: [SlideDetailBlogService],
})
export class SlideDetailBlogModule {}
