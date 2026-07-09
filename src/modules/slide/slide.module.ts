// src/modules/slide/slide.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slide } from './entities/slide.entity';
import { SlideService } from './slide.service';
import { SlideController } from './slide.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Slide])],
  providers: [SlideService],
  controllers: [SlideController],
})
export class SlideModule {}
