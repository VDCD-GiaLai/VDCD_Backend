import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Program } from '../program/entities/program.entity';
import { Solution } from '../solution/entities/solution.entity';
import { Project } from '../project/entities/project.entity';
import { Article } from '../article/entities/article.entity';
import { Job } from '../job/entities/job.entity';
import { Lead } from '../lead/entities/lead.entity';
import { AdminUser } from '../admin-user/entities/admin-user.entity';

import { SearchQueryDto } from './dto/search-query.dto';

export interface SearchResultItem {
  id: string;
  title: string;
  slug?: string;
  url: string;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Program)
    private programRepo: Repository<Program>,
    @InjectRepository(Solution)
    private solutionRepo: Repository<Solution>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(Lead)
    private leadRepo: Repository<Lead>,
    @InjectRepository(AdminUser)
    private adminUserRepo: Repository<AdminUser>,
  ) {}

  async globalSearch(dto: SearchQueryDto, userRole: string) {
    const keyword = `%${dto.q}%`;
    const requestedTypes = dto.types
      ? dto.types.split(',').map((t) => t.trim())
      : [];

    // Define RBAC rules for search per role.
    // 'superadmin' can search everything.
    // 'editor' cannot search admin-users.
    const roleAllowedTypes: Record<string, string[]> = {
      superadmin: [
        'programs',
        'solutions',
        'projects',
        'articles',
        'jobs',
        'leads',
        'admin-users',
      ],
      editor: [
        'programs',
        'solutions',
        'projects',
        'articles',
        'jobs',
        'leads',
      ],
    };

    const allowedForRole = roleAllowedTypes[userRole] || [];

    // Intersect requested types with allowed types
    const typesToSearch = requestedTypes.length
      ? requestedTypes.filter((t) => allowedForRole.includes(t))
      : allowedForRole;

    const results: Record<string, SearchResultItem[]> = {};
    const promises: Promise<void>[] = [];

    // Helper function to map entities to generic SearchResultItem
    const mapItems = (
      items: any[],
      typePath: string,
      titleField: string,
      hasSlug = true,
    ): SearchResultItem[] => {
      return items.map((item) => ({
        id: item.id,
        title: item[titleField],
        ...(hasSlug && { slug: item.slug }),
        url: `/${typePath}/${item.id}`,
      }));
    };

    if (typesToSearch.includes('programs')) {
      promises.push(
        this.programRepo
          .find({
            where: { title: ILike(keyword) },
            select: { id: true, title: true, slug: true },
            take: 5,
          })
          .then((items) => {
            results['programs'] = mapItems(items, 'programs', 'title');
          }),
      );
    }

    if (typesToSearch.includes('solutions')) {
      promises.push(
        this.solutionRepo
          .find({
            where: { title: ILike(keyword) },
            select: { id: true, title: true, slug: true },
            take: 5,
          })
          .then((items) => {
            results['solutions'] = mapItems(items, 'solutions', 'title');
          }),
      );
    }

    if (typesToSearch.includes('projects')) {
      promises.push(
        this.projectRepo
          .find({
            where: { title: ILike(keyword) },
            select: { id: true, title: true, slug: true },
            take: 5,
          })
          .then((items) => {
            results['projects'] = mapItems(items, 'projects', 'title');
          }),
      );
    }

    if (typesToSearch.includes('articles')) {
      promises.push(
        this.articleRepo
          .find({
            where: { title: ILike(keyword) },
            select: { id: true, title: true, slug: true },
            take: 5,
          })
          .then((items) => {
            results['articles'] = mapItems(items, 'articles', 'title');
          }),
      );
    }

    if (typesToSearch.includes('jobs')) {
      promises.push(
        this.jobRepo
          .find({
            where: { title: ILike(keyword) },
            select: { id: true, title: true, slug: true },
            take: 5,
          })
          .then((items) => {
            results['jobs'] = mapItems(items, 'jobs', 'title');
          }),
      );
    }

    if (typesToSearch.includes('leads')) {
      promises.push(
        this.leadRepo
          .find({
            where: { fullName: ILike(keyword) }, // searching by fullName for leads
            select: { id: true, fullName: true },
            take: 5,
          })
          .then((items) => {
            results['leads'] = mapItems(items, 'leads', 'fullName', false);
          }),
      );
    }

    if (typesToSearch.includes('admin-users')) {
      promises.push(
        this.adminUserRepo
          .find({
            where: [{ username: ILike(keyword) }, { email: ILike(keyword) }],
            select: { id: true, username: true, email: true },
            take: 5,
          })
          .then((items) => {
            results['admin-users'] = mapItems(
              items,
              'admin-users',
              'username',
              false,
            );
          }),
      );
    }

    await Promise.all(promises);

    return results;
  }
}
