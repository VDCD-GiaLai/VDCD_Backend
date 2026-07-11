// src/modules/solution/solution.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solution } from './entities/solution.entity';
import { Article } from '../article/entities/article.entity';
import { SolutionService } from './solution.service';
import { SolutionController } from './solution.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Solution, Article])],
  providers: [SolutionService],
  controllers: [SolutionController],
  exports: [SolutionService],
})
export class SolutionModule {}
