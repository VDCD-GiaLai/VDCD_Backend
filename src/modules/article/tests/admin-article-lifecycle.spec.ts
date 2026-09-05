// src/modules/article/tests/admin-article-lifecycle.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArticleService } from '../article.service';
import { Article } from '../entities/article.entity';
import { UploadService } from '../../upload/upload.service';
import { DocumentContent } from '../../../common/types/document-content.types';

describe('Admin Article Lifecycle Integration (Phase 05 & 06)', () => {
  let service: ArticleService;
  let repo: any;
  let uploadService: any;
  let dataSource: any;

  // In-memory simulation of database state across lifecycle
  let dbArticle: Article | null = null;

  const initialContent: DocumentContent = {
    version: 1,
    blocks: [
      { id: 'h1', type: 'heading', level: 1, text: 'Tiêu đề khởi tạo' },
      { id: 'p1', type: 'paragraph', text: 'Nội dung khởi tạo' },
    ],
  };

  beforeEach(async () => {
    dbArticle = null;

    repo = {
      findOne: jest.fn(async (options: any) => {
        if (!dbArticle) return null;
        if (options?.where?.id && options.where.id !== dbArticle.id)
          return null;
        if (options?.where?.slug && options.where.slug !== dbArticle.slug)
          return null;
        if (options?.where?.isPublished === true && !dbArticle.isPublished)
          return null;
        return { ...dbArticle };
      }),
      create: jest.fn((dto) => ({
        ...dto,
        id: 'article-lifecycle-uuid',
        createdAt: new Date('2026-09-01T00:00:00.000Z'),
        updatedAt: new Date('2026-09-01T00:00:00.000Z'),
      })),
      save: jest.fn(async (entity) => {
        dbArticle = {
          ...dbArticle,
          ...entity,
          id: entity.id || 'article-lifecycle-uuid',
        };
        return dbArticle;
      }),
      update: jest.fn(async (id, fields) => {
        if (dbArticle && dbArticle.id === id) {
          dbArticle = { ...dbArticle, ...fields };
        }
      }),
      remove: jest.fn(async (entity) => {
        dbArticle = null;
        return entity;
      }),
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

  it('executes full admin article lifecycle: create draft -> read -> atomic update -> publish -> public read -> unpublish -> public 404 -> delete', async () => {
    // 1. Create draft article
    const created = await service.create({
      title: 'Bài viết mới',
      slug: 'bai-viet-vong-doi-quan-tri',
      content: initialContent,
      thumbnailFileId: 'thumb_file_1',
    });
    expect(created.id).toBe('article-lifecycle-uuid');
    expect(created.isPublished).toBe(false);
    expect(created.publishedAt).toBeNull();
    expect(uploadService.confirmUpload).toHaveBeenCalledWith('thumb_file_1');

    // 2. Read draft by ID (Admin)
    const adminDetail = await service.findById('article-lifecycle-uuid');
    expect(adminDetail.id).toBe('article-lifecycle-uuid');
    expect(adminDetail.content).toEqual(initialContent);
    expect(adminDetail.content.version).toBe(1);
    expect(adminDetail.isPublished).toBe(false);

    // 3. Update draft atomically (both metadata & content blocks)
    const updatedContent: DocumentContent = {
      version: 1,
      blocks: [
        { id: 'h1', type: 'heading', level: 1, text: 'Tiêu đề đã sửa' },
        {
          id: 'img-new',
          type: 'image',
          url: 'https://ik.imagekit.io/vdcd/new.jpg',
          fileId: 'file_img_new',
          alt: 'New Image',
        },
      ],
    };

    const updated = await service.update('article-lifecycle-uuid', {
      title: 'Tiêu đề bài viết sau cập nhật',
      content: updatedContent,
    });
    expect(updated.title).toBe('Tiêu đề bài viết sau cập nhật');
    expect(updated.content).toEqual(updatedContent);
    expect(dataSource.transaction).toHaveBeenCalled();
    expect(uploadService.confirmUpload).toHaveBeenCalledWith('file_img_new');

    // 4. Publish article
    const publishRes = await service.publish('article-lifecycle-uuid');
    expect(publishRes.isPublished).toBe(true);
    expect(publishRes.publishedAt).toBeInstanceOf(Date);

    // 5. Verify Public Read now succeeds
    const publicArticle = await service.findOneBySlug(
      'bai-viet-vong-doi-quan-tri',
    );
    expect(publicArticle.slug).toBe('bai-viet-vong-doi-quan-tri');
    expect(publicArticle.isPublished).toBe(true);

    // 6. Unpublish article
    const unpublishRes = await service.unpublish('article-lifecycle-uuid');
    expect(unpublishRes.isPublished).toBe(false);
    expect(unpublishRes.publishedAt).toBe(publishRes.publishedAt); // Preserved!

    // 7. Verify Public Read now throws 404 (unpublished)
    await expect(
      service.findOneBySlug('bai-viet-vong-doi-quan-tri'),
    ).rejects.toThrow('Không tìm thấy bài viết');

    // 8. Delete article and clean up media
    const deleteRes = await service.remove('article-lifecycle-uuid');
    expect(deleteRes.message).toBe('Deleted successfully');
    expect(uploadService.deleteFile).toHaveBeenCalledWith('thumb_file_1');
  });
});
