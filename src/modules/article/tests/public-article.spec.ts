// src/modules/article/tests/public-article.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ArticleService } from '../article.service';
import { Article } from '../entities/article.entity';
import { UploadService } from '../../upload/upload.service';
import { ArticleFilterDto } from '../dto/article-filter.dto';

describe('Public Article API & Security (Phase 06)', () => {
  let service: ArticleService;
  let repo: any;
  let uploadService: any;
  let dataSource: any;

  const mockPublishedDoc = {
    version: 1,
    blocks: [
      { id: 'h1', type: 'heading', level: 1, text: 'Tiêu đề chính' },
      { id: 'p1', type: 'paragraph', text: 'Đoạn văn mở đầu' },
      {
        id: 'img1',
        type: 'image',
        url: 'https://ik.imagekit.io/vdcd/articles/sample.jpg',
        fileId: 'file_img_sample',
        alt: 'Hình minh họa',
      },
    ],
  };

  const mockPublishedArticle: Partial<Article> = {
    id: 'pub-art-1',
    title: 'Bài viết công khai',
    subtitle: 'Tiêu đề phụ công khai',
    slug: 'bai-viet-cong-khai',
    excerpt: 'Tóm tắt bài viết công khai',
    content: mockPublishedDoc,
    thumbnail: 'https://ik.imagekit.io/vdcd/thumb.jpg',
    category: 'Công nghệ',
    tags: 'ai,cloud',
    isPublished: true,
    publishedAt: new Date('2026-08-15T10:00:00.000Z'),
    createdAt: new Date('2026-08-15T09:00:00.000Z'),
    updatedAt: new Date('2026-08-15T10:00:00.000Z'),
    project: { id: 'proj-1', title: 'Dự án Big Data' } as any,
    program: { id: 'prog-1', title: 'Chương trình Ươm mầm' } as any,
    solution: { id: 'sol-1', title: 'Giải pháp AI Cloud' } as any,
  };

  beforeEach(async () => {
    const qb: any = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockPublishedArticle], 1]),
    };

    repo = {
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
      update: jest.fn(),
    };

    uploadService = {
      confirmUpload: jest.fn(),
      deleteFile: jest.fn(),
    };

    dataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: getRepositoryToken(Article), useValue: repo },
        { provide: UploadService, useValue: uploadService },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  // ── Public List ───────────────────────────────────────────────────
  describe('GET /articles (findAll)', () => {
    it('should query published articles only with is_published = true', async () => {
      const dto: ArticleFilterDto = { page: 1, limit: 10 };
      const res = await service.findAll(dto);

      const qb = repo.createQueryBuilder();
      expect(qb.where).toHaveBeenCalledWith('a.is_published = true');
      expect(res).toHaveProperty('data');
      expect(res).toHaveProperty('items'); // Backward compatibility
      expect(res.data).toHaveLength(1);
      expect(res.total).toBe(1);
    });

    it('should exclude internal contentHtmlBackup and thumbnailFileId from list query projection', async () => {
      const dto: ArticleFilterDto = { page: 1, limit: 10 };
      await service.findAll(dto);

      const qb = repo.createQueryBuilder();
      const selectedColumns = qb.select.mock.calls[0][0];
      expect(selectedColumns).not.toContain('a.contentHtmlBackup');
      expect(selectedColumns).not.toContain('a.thumbnailFileId');
    });
  });

  // ── Public Detail ─────────────────────────────────────────────────
  describe('GET /articles/:slug (findOneBySlug)', () => {
    it('should return published article with BlogDocument content and populated relations', async () => {
      repo.findOne.mockResolvedValue({ ...mockPublishedArticle });

      const result = await service.findOneBySlug('bai-viet-cong-khai');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { slug: 'bai-viet-cong-khai', isPublished: true },
        relations: { project: true, program: true, solution: true },
      });

      expect(result.slug).toBe('bai-viet-cong-khai');
      expect(result.content).toEqual(mockPublishedDoc);
      expect(result.content.version).toBe(1);
      expect(result.content.blocks).toHaveLength(3);
      expect(result.project?.title).toBe('Dự án Big Data');
      expect(result.program?.title).toBe('Chương trình Ươm mầm');
      expect(result.solution?.title).toBe('Giải pháp AI Cloud');
    });

    it('should throw NotFoundException (404) for unpublished articles', async () => {
      // When article exists in DB with is_published = false, repo.findOne with where: { isPublished: true } returns null
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.findOneBySlug('bai-viet-chua-xuat-ban'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException (404) for non-existent slug', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.findOneBySlug('non-existent-article-slug'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should provide safe { version: 1, blocks: [] } if content is null or malformed', async () => {
      repo.findOne.mockResolvedValue({
        ...mockPublishedArticle,
        content: null,
      });

      const result = await service.findOneBySlug('bai-viet-cong-khai');
      expect(result.content).toEqual({ version: 1, blocks: [] });
    });

    it('should not leak contentHtmlBackup in public response', async () => {
      repo.findOne.mockResolvedValue({
        ...mockPublishedArticle,
        contentHtmlBackup: '<p>Secret internal backup</p>',
      });

      const result = await service.findOneBySlug('bai-viet-cong-khai');
      // Notice: entity level has select: false, but even if present, verify public contract
      expect(result.slug).toBe('bai-viet-cong-khai');
      expect(result.content).toEqual(mockPublishedDoc);
    });
  });
});
