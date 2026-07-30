import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Lead } from '../lead/entities/lead.entity';
import { Project } from '../project/entities/project.entity';
import { Job } from '../job/entities/job.entity';
import { Program } from '../program/entities/program.entity';
import { Solution } from '../solution/entities/solution.entity';
import { Article } from '../article/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Project, Job, Program, Solution, Article]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
