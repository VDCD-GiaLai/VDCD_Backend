import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../lead/entities/lead.entity';
import { Project } from '../project/entities/project.entity';
import { Job } from '../job/entities/job.entity';
import { Program } from '../program/entities/program.entity';
import { Solution } from '../solution/entities/solution.entity';
import { Article } from '../article/entities/article.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
    @InjectRepository(Program) private programRepo: Repository<Program>,
    @InjectRepository(Solution) private solutionRepo: Repository<Solution>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}

  async getStats() {
    const unreadLeadsCount = await this.leadRepo.count({
      where: { isRead: false },
    });
    const publishedProjectsCount = await this.projectRepo.count({
      where: { isPublished: true },
    });

    const activeJobs = await this.jobRepo.find({ where: { isActive: true } });
    const activeJobsCount = activeJobs.length;
    const urgentJobsCount = activeJobs.filter((job) => job.isUrgent).length;

    const programCount = await this.programRepo.count();
    const solutionCount = await this.solutionRepo.count();
    const articleCount = await this.articleRepo.count();
    const projectCount = await this.projectRepo.count();
    const totalContentCount =
      programCount + solutionCount + articleCount + projectCount;

    return {
      unreadLeads: unreadLeadsCount,
      publishedProjects: publishedProjectsCount,
      activeJobs: activeJobsCount,
      urgentJobs: urgentJobsCount,
      totalContent: totalContentCount,
    };
  }

  async getLeadTrends(range: string) {
    const days = range === '30days' ? 30 : 7;
    const date = new Date();
    date.setDate(date.getDate() - days);

    // Normalize date to start of day
    date.setHours(0, 0, 0, 0);

    const result = await this.leadRepo
      .createQueryBuilder('lead')
      .select('DATE(lead.created_at)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('lead.created_at >= :date', { date })
      .groupBy('DATE(lead.created_at)')
      .orderBy('DATE(lead.created_at)', 'ASC')
      .getRawMany();

    const map = new Map<string, number>();
    result.forEach((row) => {
      const d = new Date(row.date);
      // local date string
      const dateStr = d.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      map.set(dateStr, parseInt(row.count, 10));
    });

    const trends: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      trends.push({
        date: dateStr,
        count: map.get(dateStr) || 0,
      });
    }

    return trends;
  }

  async getDrafts(page: number = 1, limit: number = 5) {
    const programs = await this.programRepo.find({
      where: { isPublished: false },
      select: { id: true, title: true, updatedAt: true },
    });
    const solutions = await this.solutionRepo.find({
      where: { isPublished: false },
      select: { id: true, title: true, updatedAt: true },
    });
    const projects = await this.projectRepo.find({
      where: { isPublished: false },
      select: { id: true, title: true, updatedAt: true },
    });
    const articles = await this.articleRepo.find({
      where: { isPublished: false },
      select: { id: true, title: true, updatedAt: true },
    });

    const drafts = [
      ...programs.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'program',
        updatedAt: p.updatedAt,
      })),
      ...solutions.map((s) => ({
        id: s.id,
        title: s.title,
        type: 'solution',
        updatedAt: s.updatedAt,
      })),
      ...projects.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'project',
        updatedAt: p.updatedAt,
      })),
      ...articles.map((a) => ({
        id: a.id,
        title: a.title,
        type: 'article',
        updatedAt: a.updatedAt,
      })),
    ];

    // Sort by updatedAt ASC (oldest first)
    drafts.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );

    const total = drafts.length;
    const items = drafts.slice((page - 1) * limit, page * limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
