// src/modules/article/tests/admin-article.controller.spec.ts
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { AdminArticleController } from '../admin-article.controller';
import { ArticleService } from '../article.service';
import { UploadService } from '../../upload/upload.service';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { ArticleFilterDto } from '../dto/article-filter.dto';

describe('AdminArticleController (Phase 05 Admin APIs & RBAC)', () => {
  let controller: AdminArticleController;
  let service: any;
  let uploadService: any;
  let reflector: Reflector;

  const mockArticle = {
    id: 'uuid-1',
    title: 'Admin Article Test',
    subtitle: 'Subtitle test',
    slug: 'admin-article-test',
    excerpt: 'Excerpt test',
    content: {
      version: 1,
      blocks: [{ id: 'b1', type: 'paragraph', text: 'Admin test' }],
    },
    isPublished: false,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    service = {
      findAllAdmin: jest.fn().mockResolvedValue({
        items: [mockArticle],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
      findById: jest.fn().mockResolvedValue(mockArticle),
      create: jest.fn().mockResolvedValue(mockArticle),
      update: jest.fn().mockResolvedValue({ ...mockArticle, title: 'Updated' }),
      publish: jest.fn().mockResolvedValue({
        id: 'uuid-1',
        isPublished: true,
        publishedAt: new Date(),
      }),
      unpublish: jest.fn().mockResolvedValue({
        id: 'uuid-1',
        isPublished: false,
        publishedAt: mockArticle.publishedAt,
      }),
      remove: jest.fn().mockResolvedValue({ message: 'Deleted successfully' }),
    };

    uploadService = {
      uploadArticleImage: jest.fn().mockResolvedValue({
        url: 'https://ik.imagekit.io/vdcd/articles/admin-article-test/img.jpg',
        fileId: 'file_test_1',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminArticleController],
      providers: [
        { provide: ArticleService, useValue: service },
        { provide: UploadService, useValue: uploadService },
        Reflector,
      ],
    }).compile();

    controller = module.get<AdminArticleController>(AdminArticleController);
    reflector = module.get<Reflector>(Reflector);
  });

  // ── Endpoint Delegation ───────────────────────────────────────────
  describe('Endpoint Delegation', () => {
    it('findAll delegates to service.findAllAdmin', async () => {
      const dto: ArticleFilterDto = { page: 1, limit: 10 };
      const res = await controller.findAll(dto);
      expect(service.findAllAdmin).toHaveBeenCalledWith(dto);
      expect(res.items).toHaveLength(1);
    });

    it('findById delegates to service.findById', async () => {
      const res = await controller.findById('uuid-1');
      expect(service.findById).toHaveBeenCalledWith('uuid-1');
      expect(res.id).toBe('uuid-1');
    });

    it('create delegates to service.create', async () => {
      const dto: CreateArticleDto = {
        title: 'New Article',
        content: { version: 1, blocks: [] },
      };
      const res = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(res.title).toBe(mockArticle.title);
    });

    it('updatePut delegates to service.update', async () => {
      const dto: UpdateArticleDto = { title: 'Updated Title' };
      const res = await controller.updatePut('uuid-1', dto);
      expect(service.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(res.title).toBe('Updated');
    });

    it('updatePatch delegates to service.update', async () => {
      const dto: UpdateArticleDto = { title: 'Updated Title' };
      const res = await controller.updatePatch('uuid-1', dto);
      expect(service.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(res.title).toBe('Updated');
    });

    it('publish delegates to service.publish', async () => {
      const res = await controller.publish('uuid-1');
      expect(service.publish).toHaveBeenCalledWith('uuid-1');
      expect(res.isPublished).toBe(true);
    });

    it('unpublish delegates to service.unpublish', async () => {
      const res = await controller.unpublish('uuid-1');
      expect(service.unpublish).toHaveBeenCalledWith('uuid-1');
      expect(res.isPublished).toBe(false);
    });

    it('remove delegates to service.remove', async () => {
      const res = await controller.remove('uuid-1');
      expect(service.remove).toHaveBeenCalledWith('uuid-1');
      expect(res.message).toBe('Deleted successfully');
    });

    it('uploadImage delegates to uploadService.uploadArticleImage', async () => {
      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;
      const req = { user: { id: 'user-editor-1' } };

      const res = await controller.uploadImage(fakeFile, req, 'bai-viet-slug');

      expect(uploadService.uploadArticleImage).toHaveBeenCalledWith(
        fakeFile,
        'user-editor-1',
        'bai-viet-slug',
      );
      expect(res.fileId).toBe('file_test_1');
    });

    it('uploadImageForArticle looks up article slug and delegates to uploadService.uploadArticleImage', async () => {
      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;
      const req = { user: { id: 'user-editor-1' } };

      const res = await controller.uploadImageForArticle(
        'uuid-1',
        fakeFile,
        req,
      );

      expect(service.findById).toHaveBeenCalledWith('uuid-1');
      expect(uploadService.uploadArticleImage).toHaveBeenCalledWith(
        fakeFile,
        'user-editor-1',
        'admin-article-test',
      );
      expect(res.fileId).toBe('file_test_1');
    });
  });

  // ── RBAC Authorization Metadata ───────────────────────────────────
  describe('RBAC Authorization Decorators', () => {
    it('GET /admin/articles allows viewer, editor, superadmin', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.findAll);
      expect(roles).toEqual(['superadmin', 'editor', 'viewer']);
      expect(roles).toContain('viewer');
      expect(roles).toContain('editor');
      expect(roles).toContain('superadmin');
    });

    it('GET /admin/articles/:id allows viewer, editor, superadmin', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.findById);
      expect(roles).toEqual(['superadmin', 'editor', 'viewer']);
      expect(roles).toContain('viewer');
    });

    it('POST /admin/articles permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.create);
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
      expect(roles).toContain('editor');
      expect(roles).toContain('superadmin');
    });

    it('PUT /admin/articles/:id permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.updatePut);
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
    });

    it('PATCH /admin/articles/:id permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.updatePatch);
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
    });

    it('POST /admin/articles/:id/publish permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.publish);
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
    });

    it('POST /admin/articles/:id/unpublish permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.unpublish);
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
    });

    it('DELETE /admin/articles/:id is restricted to superadmin only', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.remove);
      expect(roles).toEqual(['superadmin']);
      expect(roles).not.toContain('editor');
      expect(roles).not.toContain('viewer');
    });

    it('POST /admin/articles/upload-image permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(ROLES_KEY, controller.uploadImage);
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
    });

    it('POST /admin/articles/:id/upload-image permits editor & superadmin, denies viewer', () => {
      const roles = reflector.get<string[]>(
        ROLES_KEY,
        controller.uploadImageForArticle,
      );
      expect(roles).toEqual(['superadmin', 'editor']);
      expect(roles).not.toContain('viewer');
    });
  });
});
