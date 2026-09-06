// src/modules/project/tests/project-image-lifecycle.spec.ts
import { UploadService } from '../../upload/upload.service';
import { ProjectService } from '../project.service';
import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../entities/project.entity';

describe('PHASE 06 — ImageKit Architecture & Lifecycle for Project', () => {
  let uploadService: UploadService;
  let mockImageKit: any;
  let mockUploadTempRepo: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockImageKit = {
      upload: jest.fn().mockImplementation(({ folder, fileName }) =>
        Promise.resolve({
          fileId: `fid-${Date.now()}`,
          url: `https://ik.imagekit.io/test${folder}/${fileName}`,
          filePath: `${folder}/${fileName}`,
          name: fileName,
          size: 1024,
        }),
      ),
      moveFolder: jest.fn().mockResolvedValue(true),
      deleteFile: jest.fn().mockResolvedValue(true),
    };

    mockUploadTempRepo = {
      create: jest.fn((e) => e),
      save: jest.fn((e) => Promise.resolve(e)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      find: jest.fn().mockResolvedValue([]),
    };

    mockConfigService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'imagekit.publicKey') return 'test-pub';
        if (key === 'imagekit.privateKey') return 'test-priv';
        if (key === 'imagekit.urlEndpoint')
          return 'https://ik.imagekit.io/test';
        return '';
      }),
    };

    uploadService = new UploadService(mockUploadTempRepo, mockConfigService);
    (uploadService as any).imagekit = mockImageKit;
  });

  describe('UploadService.uploadProjectImage Folder Convention', () => {
    const mockFile: Express.Multer.File = {
      buffer: Buffer.from('fake-image-bytes'),
      originalname: 'urban-plan.png',
      mimetype: 'image/png',
      size: 1024,
    } as any;

    it('CASE 1: Upload with slug should place image under /vdcd/projects/{slug}', async () => {
      const result = await uploadService.uploadProjectImage(
        mockFile,
        'user-1',
        'smart-city-gia-lai',
      );

      expect(mockImageKit.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: '/vdcd/projects/smart-city-gia-lai',
        }),
      );
      expect(result.url).toContain('/vdcd/projects/smart-city-gia-lai/');
    });

    it('CASE 2: Upload without slug should generate a stable project-{randomId} key', async () => {
      const result = await uploadService.uploadProjectImage(
        mockFile,
        'user-1',
        undefined,
      );

      expect(mockImageKit.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: expect.stringMatching(
            /^\/vdcd\/projects\/project-[a-z0-9]{8}$/,
          ),
        }),
      );
      expect(result.url).toMatch(/\/vdcd\/projects\/project-[a-z0-9]{8}\//);
    });

    it('CASE 2b: Multiple uploads in same session using tempFolderKey should share identical folder', async () => {
      const sessionKey = 'project-a8f31c';

      const file1: Express.Multer.File = {
        buffer: Buffer.from('image-1'),
        originalname: 'thumbnail.webp',
        mimetype: 'image/webp',
        size: 500,
      } as any;

      const file2: Express.Multer.File = {
        buffer: Buffer.from('image-2'),
        originalname: 'challenge.webp',
        mimetype: 'image/webp',
        size: 600,
      } as any;

      const file3: Express.Multer.File = {
        buffer: Buffer.from('image-3'),
        originalname: 'result.webp',
        mimetype: 'image/webp',
        size: 700,
      } as any;

      const res1 = await uploadService.uploadProjectImage(
        file1,
        'user-1',
        sessionKey,
      );
      const res2 = await uploadService.uploadProjectImage(
        file2,
        'user-1',
        sessionKey,
      );
      const res3 = await uploadService.uploadProjectImage(
        file3,
        'user-1',
        sessionKey,
      );

      expect(mockImageKit.upload).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ folder: '/vdcd/projects/project-a8f31c' }),
      );
      expect(mockImageKit.upload).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ folder: '/vdcd/projects/project-a8f31c' }),
      );
      expect(mockImageKit.upload).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ folder: '/vdcd/projects/project-a8f31c' }),
      );

      expect(res1.url).toContain('/vdcd/projects/project-a8f31c/');
      expect(res2.url).toContain('/vdcd/projects/project-a8f31c/');
      expect(res3.url).toContain('/vdcd/projects/project-a8f31c/');
    });

    it('Security & Sanitization: Traversal attempts must be stripped into a safe folder', async () => {
      await uploadService.uploadProjectImage(
        mockFile,
        'user-1',
        '../../secret/etc/passwd',
      );

      expect(mockImageKit.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: '/vdcd/projects/secret-etc-passwd',
        }),
      );
    });
  });

  describe('ProjectService Slug Migration & Folder Lifecycle', () => {
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
        create: jest.fn((dto) => ({ ...dto, id: 'proj-123' })),
        save: jest.fn((entity) => Promise.resolve(entity)),
        remove: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      };

      mockRawRepo = {
        findOne: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
        create: jest.fn((dto) => ({ ...dto, id: 'proj-123' })),
        save: jest.fn((entity) => Promise.resolve(entity)),
        remove: jest.fn().mockResolvedValue({}),
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(0),
        }),
      };

      mockImageRepo = {
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
          url: 'https://ik.imagekit.io/test/vdcd/projects/mock/img.jpg',
          fileId: 'mock-fid',
        }),
        moveFolder: jest.fn().mockResolvedValue(true),
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

    it('CASE 5: create with tempFolderKey triggers moveFolder and rewrites URLs', async () => {
      mockProjectRepo.findBySlug?.mockResolvedValue(null);

      const dto = {
        title: 'Khu Đô Thị Mới',
        slug: 'khu-do-thi-moi',
        tempFolderKey: 'project-a8f31c',
        thumbnail:
          'https://ik.imagekit.io/test/vdcd/projects/project-a8f31c/thumb.webp',
        thumbnailFileId: 'thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b-1',
              type: 'image',
              url: 'https://ik.imagekit.io/test/vdcd/projects/project-a8f31c/plan.webp',
              fileId: 'plan-fid',
              alt: 'Bản đồ quy hoạch',
            },
          ],
        },
      };

      const result = await service.create(dto);
      expect(result).toBeDefined();

      // moveFolder must be called with old and new paths
      expect(mockUploadService.moveFolder).toHaveBeenCalledWith(
        '/vdcd/projects/project-a8f31c',
        '/vdcd/projects/khu-do-thi-moi',
      );

      // URLs must be rewritten to new slug
      expect(result.thumbnail).toBe(
        'https://ik.imagekit.io/test/vdcd/projects/khu-do-thi-moi/thumb.webp',
      );
      expect((result.content as any).blocks[0].url).toBe(
        'https://ik.imagekit.io/test/vdcd/projects/khu-do-thi-moi/plan.webp',
      );
    });

    it('CASE 4: update with changed slug triggers moveFolder and rewrites stored URLs', async () => {
      const existingProject: Partial<Project> = {
        id: 'proj-456',
        title: 'Smart City Gia Lai',
        slug: 'smart-city',
        thumbnail:
          'https://ik.imagekit.io/test/vdcd/projects/smart-city/thumb.webp',
        thumbnailFileId: 'thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b-img',
              type: 'image',
              url: 'https://ik.imagekit.io/test/vdcd/projects/smart-city/map.webp',
              fileId: 'map-fid',
              alt: 'Bản đồ số',
            },
          ],
        } as any,
        images: [
          {
            id: 'gallery-img-1',
            url: 'https://ik.imagekit.io/test/vdcd/projects/smart-city/gallery1.webp',
            fileId: 'gallery-fid-1',
          } as any,
        ],
      };

      mockDataSource.transaction = jest.fn(async (cb) => {
        const manager = {
          findOne: jest.fn().mockResolvedValue(existingProject),
          save: jest.fn((_cls, entity) => Promise.resolve(entity)),
        };
        return cb(manager);
      });

      const updated = await service.update('proj-456', {
        slug: 'smart-city-gia-lai',
      });

      expect(updated).toBeDefined();

      // moveFolder must be triggered from old slug to new slug
      expect(mockUploadService.moveFolder).toHaveBeenCalledWith(
        '/vdcd/projects/smart-city',
        '/vdcd/projects/smart-city-gia-lai',
      );

      // Stored URLs must be updated to new slug
      expect(updated.thumbnail).toBe(
        'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/thumb.webp',
      );
      expect((updated.content as any).blocks[0].url).toBe(
        'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/map.webp',
      );
      expect(updated.images[0].url).toBe(
        'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/gallery1.webp',
      );
    });

    it('CASE 3: addImages passes project.slug to ensure gallery images belong to project folder', async () => {
      mockProjectRepo.findById?.mockResolvedValue({
        id: 'proj-789',
        slug: 'ha-long-marina',
        images: [],
      });

      const files = [
        {
          buffer: Buffer.from('img1'),
          originalname: 'g1.jpg',
        } as Express.Multer.File,
        {
          buffer: Buffer.from('img2'),
          originalname: 'g2.jpg',
        } as Express.Multer.File,
      ];

      await service.addImages('proj-789', files, ['Ảnh 1', 'Ảnh 2'], 'user-1');

      // uploadProjectImage must receive project.slug
      expect(mockUploadService.uploadProjectImage).toHaveBeenCalledWith(
        files[0],
        'user-1',
        'ha-long-marina',
      );
      expect(mockUploadService.uploadProjectImage).toHaveBeenCalledWith(
        files[1],
        'user-1',
        'ha-long-marina',
      );
    });
  });
});
