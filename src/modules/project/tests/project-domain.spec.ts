// src/modules/project/tests/project-domain.spec.ts
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../project.service';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectController } from '../project.controller';
import { AdminProjectController } from '../admin-project.controller';
import { validateProjectDocument } from '../validators/project-content.validator';
import { DocumentContent } from '../../../common/types/document-content.types';

describe('Project Domain & Document Model Refactor Tests (Phase 05)', () => {
  describe('Project Document Validator (validateProjectDocument)', () => {
    it('should return empty document structure when input is empty or non-object', () => {
      expect(validateProjectDocument(null)).toEqual({
        version: 1,
        blocks: [],
      });
      expect(validateProjectDocument(undefined)).toEqual({
        version: 1,
        blocks: [],
      });
      expect(validateProjectDocument('')).toEqual({
        version: 1,
        blocks: [],
      });
    });

    it('should validate valid DocumentContent with sections, headings, paragraphs, and images', () => {
      const validDoc: DocumentContent = {
        version: 1,
        blocks: [
          {
            id: 'sec-1',
            type: 'section',
            number: '01',
            title: 'Tổng quan',
            children: [
              {
                id: 'p-1',
                type: 'paragraph',
                text: 'Tổng quan công trình số',
              },
            ],
          },
          {
            id: 'img-1',
            type: 'image',
            url: 'https://ik.imagekit.io/test/proj.jpg',
            fileId: 'proj-fid-1',
            alt: 'Ảnh minh họa',
          },
        ],
      };

      const result = validateProjectDocument(validDoc);
      expect(result.version).toBe(1);
      expect(result.blocks).toHaveLength(2);
    });

    it('should throw BadRequestException if block has invalid type', () => {
      const invalidDoc = {
        version: 1,
        blocks: [
          {
            id: 'blk-unknown',
            type: 'unsupported_type',
            text: 'test',
          },
        ],
      };

      expect(() => validateProjectDocument(invalidDoc)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('ProjectService CRUD & Document Model', () => {
    let service: ProjectService;
    let mockProjectRepo: Partial<Record<keyof ProjectRepository, jest.Mock>>;
    let mockRawRepo: any;
    let mockImageRepo: any;
    let mockArticleRepo: any;
    let mockUploadService: any;
    let mockDataSource: any;

    beforeEach(() => {
      mockProjectRepo = {
        findPublished: jest.fn().mockResolvedValue([[], 0]),
        findAllAdmin: jest.fn().mockResolvedValue([[], 0]),
        findOneBySlug: jest.fn(),
        findById: jest.fn(),
        findBySlug: jest.fn(),
        create: jest.fn((dto) => ({ ...dto, id: 'mock-proj-uuid' })),
        save: jest.fn((entity) =>
          Promise.resolve({ ...entity, id: entity.id || 'mock-proj-uuid' }),
        ),
        remove: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      };

      mockRawRepo = {
        findOne: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
        create: jest.fn((dto) => ({ ...dto, id: 'mock-proj-uuid' })),
        save: jest.fn((entity) => Promise.resolve(entity)),
        remove: jest.fn().mockResolvedValue({}),
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        }),
      };

      mockImageRepo = {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn(),
        create: jest.fn((dto) => dto),
        save: jest.fn((entities) => Promise.resolve(entities)),
        remove: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      };

      mockArticleRepo = {
        find: jest.fn().mockResolvedValue([]),
      };

      mockUploadService = {
        confirmUpload: jest.fn().mockResolvedValue({ status: 'confirmed' }),
        deleteFile: jest.fn().mockResolvedValue({ status: 'deleted' }),
        uploadProjectImage: jest.fn().mockResolvedValue({
          url: 'https://ik.imagekit.io/test/img.jpg',
          fileId: 'img-fid-new',
        }),
        moveFolder: jest.fn().mockResolvedValue({}),
      };

      mockDataSource = {
        transaction: jest.fn(async (cb) => {
          const manager = {
            findOne: jest.fn(),
            save: jest.fn((_cls, entity) => Promise.resolve(entity)),
          };
          return cb(manager);
        }),
        query: jest.fn().mockResolvedValue([{ count: 0 }]),
      };

      service = new ProjectService(
        mockProjectRepo as any,
        mockRawRepo,
        mockImageRepo,
        mockArticleRepo,
        mockUploadService,
        mockDataSource,
      );
    });

    it('should create project with structured Document Content and confirm inline image uploads', async () => {
      mockProjectRepo.findBySlug?.mockResolvedValue(null);

      const dto = {
        title: 'Dự án Cầu Vàng',
        slug: 'du-an-cau-vang',
        thumbnail: 'https://ik.imagekit.io/test/thumb.jpg',
        thumbnailFileId: 'thumb-fid-1',
        content: {
          version: 1,
          blocks: [
            {
              id: 'sec-1',
              type: 'section',
              number: '01',
              title: 'Tổng quan',
              children: [
                {
                  id: 'p-1',
                  type: 'paragraph',
                  text: 'Khảo sát hiện trạng cầu.',
                },
                {
                  id: 'img-block-1',
                  type: 'image',
                  url: 'https://ik.imagekit.io/test/bridge.jpg',
                  fileId: 'bridge-fid-1',
                  alt: 'Cầu Vàng',
                },
              ],
            },
          ],
        },
      };

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockProjectRepo.create).toHaveBeenCalled();
      expect(mockProjectRepo.save).toHaveBeenCalled();
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'thumb-fid-1',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'bridge-fid-1',
      );
    });

    it('should auto-convert legacy fields to standard DocumentContent if content is not provided', async () => {
      mockProjectRepo.findBySlug?.mockResolvedValue(null);

      const legacyDto = {
        title: 'Dự án Đo Đạc',
        slug: 'du-an-do-dac',
        overview: 'Nội dung tổng quan trắc địa',
        challenge: 'Địa hình đồi núi phức tạp',
        challengeImage: 'https://ik.imagekit.io/test/mountain.jpg',
        challengeImageFileId: 'mountain-fid',
        services: ['Flycam 3D', 'Bản vẽ 1/500'],
      };

      const result = await service.create(legacyDto);
      expect(result).toBeDefined();
      expect(mockProjectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            version: 1,
            blocks: expect.arrayContaining([
              expect.objectContaining({
                type: 'section',
                title: 'Tổng quan',
              }),
              expect.objectContaining({
                type: 'section',
                title: 'Thách thức',
              }),
            ]),
          }),
          contentHtmlBackup: expect.any(String),
        }),
      );
    });

    it('should throw ConflictException on duplicate slug', async () => {
      mockProjectRepo.findBySlug?.mockResolvedValue({ id: 'existing-proj' });

      await expect(
        service.create({
          title: 'Dự án trùng lặp',
          slug: 'du-an-trung-lap',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should update project content via PATCH /projects/:id with image diffing and orphan cleanup', async () => {
      const existingProject = {
        id: 'proj-uuid-1',
        title: 'Dự án Cũ',
        slug: 'du-an-cu',
        thumbnail: 'https://ik.imagekit.io/test/old-thumb.jpg',
        thumbnailFileId: 'old-thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-to-delete',
              type: 'image',
              url: 'https://ik.imagekit.io/test/delete.jpg',
              fileId: 'delete-fid-1',
              alt: 'Ảnh bị xóa',
            },
            {
              id: 'img-retained',
              type: 'image',
              url: 'https://ik.imagekit.io/test/retain.jpg',
              fileId: 'retain-fid-2',
              alt: 'Ảnh giữ lại',
            },
          ],
        },
      };

      mockDataSource.transaction = jest.fn(async (cb) => {
        const manager = {
          findOne: jest.fn().mockResolvedValue(existingProject),
          save: jest.fn((_cls, entity) => Promise.resolve(entity)),
        };
        return cb(manager);
      });

      const updatePayload = {
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-retained',
              type: 'image',
              url: 'https://ik.imagekit.io/test/retain.jpg',
              fileId: 'retain-fid-2',
              alt: 'Ảnh giữ lại',
            },
            {
              id: 'img-new',
              type: 'image',
              url: 'https://ik.imagekit.io/test/new.jpg',
              fileId: 'new-fid-3',
              alt: 'Ảnh mới thêm',
            },
          ],
        },
      };

      const updated = await service.update('proj-uuid-1', updatePayload);
      expect(updated).toBeDefined();

      // Confirms newly added image
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith('new-fid-3');

      // Cleans up removed image
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith('delete-fid-1');
    });

    it('should reject invalid document content on update with BadRequestException', async () => {
      mockDataSource.transaction = jest.fn(async (cb) => {
        const manager = {
          findOne: jest.fn().mockResolvedValue({
            id: 'proj-1',
            content: { version: 1, blocks: [] },
          }),
          save: jest.fn(),
        };
        return cb(manager);
      });

      const badUpdate = {
        content: {
          version: 999, // Invalid version
          blocks: [{ type: 'invalid_block' }],
        },
      };

      await expect(service.update('proj-1', badUpdate as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should find one by slug with relations and related articles', async () => {
      const mockProj = {
        id: 'proj-1',
        slug: 'cau-rong-da-nang',
        title: 'Cầu Rồng Đà Nẵng',
        isPublished: true,
        content: { version: 1, blocks: [] },
      };
      mockProjectRepo.findOneBySlug?.mockResolvedValue(mockProj);

      const result = await service.findOneBySlug('cau-rong-da-nang');
      expect(result).toBeDefined();
      expect(result.id).toBe('proj-1');
      expect(result.relatedArticles).toBeDefined();
      expect(result.relatedProjects).toBeDefined();
    });

    it('should find by ID for admin', async () => {
      const mockProj = {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'Dự án Admin',
        isPublished: false,
      };
      mockProjectRepo.findById?.mockResolvedValue(mockProj);

      const result = await service.findById(
        '11111111-1111-1111-1111-111111111111',
      );
      expect(result).toBeDefined();
      expect(result.id).toBe('11111111-1111-1111-1111-111111111111');
    });

    it('should throw NotFoundException if project not found by slug', async () => {
      mockProjectRepo.findOneBySlug?.mockResolvedValue(null);

      await expect(service.findOneBySlug('khong-ton-tai')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should remove project and clean up all media from ImageKit', async () => {
      const projToDelete = {
        id: 'proj-del-1',
        thumbnailFileId: 'thumb-del-fid',
        images: [{ fileId: 'gallery-del-fid-1' }],
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-del',
              type: 'image',
              url: 'https://test.com/img.jpg',
              fileId: 'content-del-fid-2',
            },
          ],
        },
      };

      mockProjectRepo.findById?.mockResolvedValue(projToDelete);

      const result = await service.remove('proj-del-1');
      expect(result).toEqual({ message: 'Deleted successfully' });
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'thumb-del-fid',
      );
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'gallery-del-fid-1',
      );
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'content-del-fid-2',
      );
      expect(mockProjectRepo.remove).toHaveBeenCalledWith(projToDelete);
    });
  });

  describe('ProjectController & AdminProjectController API Endpoints', () => {
    let projectController: ProjectController;
    let adminController: AdminProjectController;
    let mockService: any;

    beforeEach(() => {
      mockService = {
        findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        findAllAdmin: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        findOneBySlug: jest
          .fn()
          .mockResolvedValue({ id: 'p-1', slug: 'p-slug' }),
        findById: jest.fn().mockResolvedValue({ id: 'p-1', title: 'P Title' }),
        create: jest.fn().mockResolvedValue({ id: 'p-new' }),
        update: jest.fn().mockResolvedValue({ id: 'p-updated' }),
        togglePublish: jest
          .fn()
          .mockResolvedValue({ id: 'p-1', isPublished: true }),
        remove: jest
          .fn()
          .mockResolvedValue({ message: 'Deleted successfully' }),
      };

      projectController = new ProjectController(mockService);
      adminController = new AdminProjectController(mockService);
    });

    it('ProjectController PATCH /projects/:id updates project with document content', async () => {
      const patchDto = {
        content: {
          version: 1,
          blocks: [
            {
              id: 'sec-1',
              type: 'section',
              number: '01',
              title: 'Tổng quan',
              children: [],
            },
          ],
        },
      };

      const result = await projectController.update('proj-uuid', patchDto);
      expect(result).toEqual({ id: 'p-updated' });
      expect(mockService.update).toHaveBeenCalledWith('proj-uuid', patchDto);
    });

    it('AdminProjectController PUT and PATCH /admin/projects/:id delegate to service.update', async () => {
      const updateDto = { title: 'Updated Title' };
      await adminController.replace('p-1', updateDto);
      expect(mockService.update).toHaveBeenCalledWith('p-1', updateDto);

      await adminController.update('p-1', updateDto);
      expect(mockService.update).toHaveBeenCalledWith('p-1', updateDto);
    });

    it('AdminProjectController GET /admin/projects/:id delegates to service.findById', async () => {
      const result = await adminController.findOne('p-1');
      expect(result).toEqual({ id: 'p-1', title: 'P Title' });
      expect(mockService.findById).toHaveBeenCalledWith('p-1');
    });
  });
});
