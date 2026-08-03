import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

import { Program } from '../program/entities/program.entity';
import { Solution } from '../solution/entities/solution.entity';
import { Project } from '../project/entities/project.entity';
import { Article } from '../article/entities/article.entity';
import { Job } from '../job/entities/job.entity';
import { Lead } from '../lead/entities/lead.entity';
import { AdminUser } from '../admin-user/entities/admin-user.entity';
import { Contact } from '../contact/entities/contact.entity';
import { PageBanner } from '../page-banner/entities/page-banner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Program,
      Solution,
      Project,
      Article,
      Job,
      Lead,
      AdminUser,
      Contact,
      PageBanner,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
