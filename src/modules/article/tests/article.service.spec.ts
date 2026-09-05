import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ArticleService } from '../article.service';
import { Article } from '../entities/article.entity';
import { UploadService } from '../../upload/upload.service';
import { DocumentContent } from '../../../common/types/document-content.types';

describe('ArticleService (Phase 04 & 05 Domain & Admin Lifecycle)', () => {
  let service: ArticleService;
  let repo: any;
  let uploadService: any;
  let dataSource: any;

  const sampleDoc: DocumentContent = {
    version: 1,
    blocks: [
      { id: 'h1', type: 'heading', level: 1, text: 'Main Heading' },
      { id: 'p1', type: 'paragraph', text: 'Introduction text' },
      {
        id: 'img1',
        type: 'image',
        url: 'https://ik.imagekit.io/vdcd/articles/img-1.jpg',
        fileId: 'file_img_1',
        alt: 'Photo 1',
      },
    ],
  };

  const mockArticle: Partial<Article> = {
    id: 'art-uuid-1',
    title: 'Bài viết chuyển đổi số',
    subtitle: 'Tiêu đề phụ',
    slug: 'bai-viet-chuyen-doi-so',
    excerpt: 'Tóm tắt bài viết',
    content: sampleDoc,
    thumbnail: 'https://ik.imagekit.io/vdcd/thumb.jpg',
    thumbnailFileId: 'thumb_file_1',
    category: 'Chuyển đổi số',
    tags: 'so-hoa,ai',
    isPublished: false,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((dto) => ({ ...dto, id: 'art-uuid-new' })),
      save: jest.fn(async (entity) => ({
        ...entity,
        id: entity.id || 'art-uuid-new',
      })),
      update: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    uploadService = {
      confirmUpload: jest.fn().mockResolvedValue(undefined),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    dataSource = {
      transaction: jest.fn(async (callback) => {
        const manager = {
          findOne: repo.findOne,
          save: repo.save,
        };
        return callback(manager);
      }),
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

  // ── Create ───────────────────────────────────────────────────────
  describe('create', () => {
    it('should create an article with valid DocumentContent and confirm image fileIds', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.create({
        title: 'Bài viết chuyển đổi số',
        content: sampleDoc,
        thumbnailFileId: 'thumb_file_new',
      });

      expect(result.id).toBe('art-uuid-new');
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      // Verifies thumbnail was confirmed
      expect(uploadService.confirmUpload).toHaveBeenCalledWith(
        'thumb_file_new',
      );
      // Verifies inline image was confirmed
      expect(uploadService.confirmUpload).toHaveBeenCalledWith('file_img_1');
    });

    it('should reject creation if slug already exists', async () => {
      repo.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.create({
          title: 'Trùng tiêu đề',
          slug: 'trung-tieu-de',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject creation if document content contains dangerous script', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          title: 'Hacked Article',
          content: {
            version: 1,
            blocks: [
              {
                id: 'p-xss',
                type: 'paragraph',
                text: 'Bad <script>alert(1)</script>',
              },
            ],
          },
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── Update ───────────────────────────────────────────────────────
  describe('update', () => {
    it('should update article and delete orphan image fileIds on ImageKit', async () => {
      repo.findOne.mockResolvedValue({ ...mockArticle });

      const updatedDoc: DocumentContent = {
        version: 1,
        blocks: [
          { id: 'h1', type: 'heading', level: 1, text: 'Main Heading' },
          // Removed img1 (file_img_1) and added img2 (file_img_2)
          {
            id: 'img2',
            type: 'image',
            url: 'https://ik.imagekit.io/vdcd/img-2.jpg',
            fileId: 'file_img_2',
            alt: 'Photo 2',
          },
        ],
      };

      await service.update('art-uuid-1', {
        content: updatedDoc,
      });

      // Verifies old orphan image file_img_1 was deleted from ImageKit
      expect(uploadService.deleteFile).toHaveBeenCalledWith('file_img_1');
      // Verifies new image file_img_2 was confirmed
      expect(uploadService.confirmUpload).toHaveBeenCalledWith('file_img_2');
    });

    it('should delete old thumbnail when thumbnail is replaced', async () => {
      repo.findOne.mockResolvedValue({ ...mockArticle });

      await service.update('art-uuid-1', {
        thumbnail: 'https://new-url.com/thumb.jpg',
        thumbnailFileId: 'thumb_file_brand_new',
      });

      // Verifies old thumbnail was deleted
      expect(uploadService.deleteFile).toHaveBeenCalledWith('thumb_file_1');
      // Verifies new thumbnail was confirmed
      expect(uploadService.confirmUpload).toHaveBeenCalledWith(
        'thumb_file_brand_new',
      );
    });
  });

  // ── FindById (Admin Detail) ──────────────────────────────────────
  describe('findById', () => {
    it('should return article by ID including drafts', async () => {
      repo.findOne.mockResolvedValue(mockArticle);

      const result = await service.findById('art-uuid-1');
      expect(result).toEqual(mockArticle);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'art-uuid-1' },
        relations: { project: true, program: true, solution: true },
      });
    });

    it('should throw NotFoundException if article does not exist', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── FindAllAdmin (Admin List & Content Delivery) ─────────────────
  describe('findAllAdmin', () => {
    it('should select and return content blocks on every item for admin editor', async () => {
      const qb: any = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockArticle], 1]),
      };
      repo.createQueryBuilder = jest.fn().mockReturnValue(qb);

      const result = await service.findAllAdmin({ page: 1, limit: 10 });
      expect(qb.select).toHaveBeenCalledWith(
        expect.arrayContaining(['a.content']),
      );
      expect(result.items[0].content).toEqual(sampleDoc);
      expect(result.data[0].content).toEqual(sampleDoc);
    });
  });

  // ── FindOneBySlug (UUID & Slug) ──────────────────────────────────
  describe('findOneBySlug', () => {
    it('should support looking up by UUID parameter', async () => {
      repo.findOne.mockResolvedValue(mockArticle);
      const uuidParam = '11111111-aaaa-4111-a111-111111111101';

      const result = await service.findOneBySlug(uuidParam, false);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: [
          { id: uuidParam, isPublished: true },
          { slug: uuidParam, isPublished: true },
        ],
        relations: { project: true, program: true, solution: true },
      });
      expect(result.id).toBe('art-uuid-1');
      expect(result.content).toEqual(sampleDoc);
    });

    it('should support looking up by standard slug string', async () => {
      repo.findOne.mockResolvedValue(mockArticle);

      const result = await service.findOneBySlug(
        'bai-viet-chuyen-doi-so',
        false,
      );
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { slug: 'bai-viet-chuyen-doi-so', isPublished: true },
        relations: { project: true, program: true, solution: true },
      });
      expect(result.id).toBe('art-uuid-1');
    });
  });

  // ── Publish / Unpublish ──────────────────────────────────────────
  describe('publish & unpublish lifecycle', () => {
    it('should publish an article with non-empty blocks and set is_published = true, published_at = now()', async () => {
      repo.findOne.mockResolvedValue({
        ...mockArticle,
        isPublished: false,
        publishedAt: null,
      });

      const result = await service.publish('art-uuid-1');
      expect(result.isPublished).toBe(true);
      expect(result.publishedAt).toBeInstanceOf(Date);
      expect(repo.update).toHaveBeenCalledWith(
        'art-uuid-1',
        expect.objectContaining({ isPublished: true }),
      );
    });

    it('should reject publishing if title is empty', async () => {
      repo.findOne.mockResolvedValue({
        ...mockArticle,
        title: '   ',
      });

      await expect(service.publish('art-uuid-1')).rejects.toThrow(
        'Không thể xuất bản bài viết chưa có tiêu đề',
      );
    });

    it('should reject publishing if content has no blocks', async () => {
      repo.findOne.mockResolvedValue({
        ...mockArticle,
        content: { version: 1, blocks: [] },
      });

      await expect(service.publish('art-uuid-1')).rejects.toThrow(
        'Không thể xuất bản bài viết chưa có nội dung',
      );
    });

    it('should unpublish an article and preserve publishedAt timestamp', async () => {
      const originalPublishedAt = new Date('2026-08-01T00:00:00.000Z');
      repo.findOne.mockResolvedValue({
        ...mockArticle,
        isPublished: true,
        publishedAt: originalPublishedAt,
      });

      const result = await service.unpublish('art-uuid-1');
      expect(result.isPublished).toBe(false);
      expect(result.publishedAt).toEqual(originalPublishedAt);
      expect(repo.update).toHaveBeenCalledWith('art-uuid-1', {
        isPublished: false,
      });
    });
  });

  // ── Remove ───────────────────────────────────────────────────────
  describe('remove', () => {
    it('should delete article and clean up all images from ImageKit', async () => {
      repo.findOne.mockResolvedValue({ ...mockArticle });

      await service.remove('art-uuid-1');

      expect(repo.remove).toHaveBeenCalled();
      // Thumbnail deleted
      expect(uploadService.deleteFile).toHaveBeenCalledWith('thumb_file_1');
      // Inline block images deleted
      expect(uploadService.deleteFile).toHaveBeenCalledWith('file_img_1');
    });
  });
});
