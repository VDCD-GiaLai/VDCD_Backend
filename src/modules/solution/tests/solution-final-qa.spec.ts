// src/modules/solution/tests/solution-final-qa.spec.ts
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SolutionService } from '../solution.service';
import { AdminSolutionController } from '../admin-solution.controller';
import { SolutionController } from '../solution.controller';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';
import { convertSolutionHtmlToBlocks } from '../utils/html-to-blocks.util';
import {
  DocumentContent,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';

describe('PHASE 11: Solution Backend Final QA & Full Regression Test Suite', () => {
  let service: SolutionService;
  let adminController: AdminSolutionController;
  let publicController: SolutionController;
  let mockRepo: any;
  let mockArticleRepo: any;
  let mockUploadService: any;
  let mockDataSource: any;

  beforeEach(() => {
    const mockQb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    mockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ ...dto, id: 'sol-qa-uuid-1' })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue(undefined),
      createQueryBuilder: jest.fn().mockReturnValue(mockQb),
    };

    mockArticleRepo = {
      find: jest.fn().mockResolvedValue([]),
    };

    mockUploadService = {
      confirmUpload: jest.fn().mockResolvedValue(undefined),
      deleteFile: jest.fn().mockResolvedValue(undefined),
      moveFolder: jest.fn().mockResolvedValue(true),
    };

    mockDataSource = {
      transaction: jest.fn((cb) =>
        cb({
          findOne: mockRepo.findOne,
          save: mockRepo.save,
        }),
      ),
      query: jest.fn().mockResolvedValue([]),
    };

    service = new SolutionService(
      mockRepo,
      mockArticleRepo,
      mockUploadService,
      mockDataSource,
    );
    adminController = new AdminSolutionController(service);
    publicController = new SolutionController(service);
  });

  // ========================================================================
  // 1. SOLUTION METADATA & CRUD API LIFECYCLE
  // ========================================================================
  describe('1. Solution Metadata & CRUD API Lifecycle', () => {
    it('creates a solution with complete metadata, validated document content, and confirms images', async () => {
      mockRepo.findOne.mockResolvedValue(null); // Unique slug

      const dto = {
        title: 'Giải pháp Quản lý Tài nguyên và Môi trường Thông minh',
        slug: 'quan-ly-tai-nguyen-moi-truong-thong-minh',
        shortDescription:
          'Hệ thống giám sát và phân tích dữ liệu môi trường thời gian thực.',
        thumbnail: 'https://ik.imagekit.io/vdcd/solutions/gis/thumb.jpg',
        thumbnailFileId: 'fid_thumb_sol_1',
        fieldId: 'field-uuid-01',
        websiteUrl: 'https://moitruong.vdcd.vn',
        metaTitle: 'Giải pháp Môi trường | VDCD',
        metaDescription: 'Hệ thống quan trắc và cảnh báo ô nhiễm môi trường',
        isPublished: true,
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'heading',
              level: 1,
              text: 'Tổng quan Giải pháp Môi trường',
            },
            {
              id: 'b2',
              type: 'paragraph',
              text: 'Nội dung chi tiết giải pháp quan trắc tích hợp IoT.',
            },
            {
              id: 'b3',
              type: 'image',
              url: 'https://ik.imagekit.io/vdcd/solutions/gis/sensor.jpg',
              alt: 'Cảm biến quan trắc',
              caption: 'Hình ảnh trạm đo khí thải',
              fileId: 'fid_sensor_img_1',
            },
          ],
        },
      };

      const result = await adminController.create(dto);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.title).toBe(dto.title);
      expect(result.publishedAt).toBeInstanceOf(Date);
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'fid_thumb_sol_1',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'fid_sensor_img_1',
      );
    });

    it('strictly rejects duplicate slug on create with ConflictException', async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 'existing-sol-id',
        slug: 'slug-da-ton-tai',
      });

      await expect(
        service.create({
          title: 'Giải pháp Trùng Slug',
          slug: 'slug-da-ton-tai',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('updates solution metadata, cleans up replaced thumbnail and orphaned content images', async () => {
      const existingSolution = {
        id: 'sol-qa-uuid-1',
        title: 'Tên Giải Pháp Cũ',
        slug: 'ten-giai-phap-cu',
        thumbnail: 'https://ik.imagekit.io/vdcd/solutions/old-thumb.jpg',
        thumbnailFileId: 'fid-old-thumb',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: 'https://ik.imagekit.io/old1.jpg',
              fileId: 'img-fid-retained',
              alt: '1',
            },
            {
              id: 'b2',
              type: 'image',
              url: 'https://ik.imagekit.io/old2.jpg',
              fileId: 'img-fid-orphaned',
              alt: '2',
            },
          ],
        },
      };

      mockRepo.findOne.mockResolvedValue(existingSolution);

      const updateDto = {
        title: 'Tên Giải Pháp Mới',
        thumbnail: 'https://ik.imagekit.io/vdcd/solutions/new-thumb.jpg',
        thumbnailFileId: 'fid-new-thumb',
        content: {
          version: 1,
          blocks: [
            // Retains img-fid-retained, removes img-fid-orphaned, adds img-fid-new
            {
              id: 'b1',
              type: 'image',
              url: 'https://ik.imagekit.io/old1.jpg',
              fileId: 'img-fid-retained',
              alt: '1',
            },
            {
              id: 'b3',
              type: 'image',
              url: 'https://ik.imagekit.io/new3.jpg',
              fileId: 'img-fid-new',
              alt: '3',
            },
          ],
        },
      };

      await service.update('sol-qa-uuid-1', updateDto);

      // Deletes old replaced thumbnail
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'fid-old-thumb',
      );
      // Deletes orphaned image from content diff
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'img-fid-orphaned',
      );
      // Confirms new thumbnail and new content image
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'fid-new-thumb',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'img-fid-new',
      );
    });

    it('toggles publish status and manages publishedAt timestamp synchronously', async () => {
      const draft = {
        id: 'sol-draft-1',
        isPublished: false,
        publishedAt: null,
      };
      mockRepo.findOne.mockResolvedValue(draft);

      // 1. Publish
      const published = await service.togglePublish('sol-draft-1', true);
      expect(published.isPublished).toBe(true);
      expect(published.publishedAt).toBeInstanceOf(Date);

      // 2. Unpublish
      mockRepo.findOne.mockResolvedValue({
        id: 'sol-draft-1',
        isPublished: true,
        publishedAt: new Date(),
      });
      const unpublished = await service.togglePublish('sol-draft-1', false);
      expect(unpublished.isPublished).toBe(false);
      expect(unpublished.publishedAt).toBeNull();
    });

    it('deletes a solution and cleans up all thumbnail and content media from ImageKit', async () => {
      const solWithMedia = {
        id: 'sol-del-1',
        thumbnailFileId: 'thumb-fid-del',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: 'http://example.com/del.jpg',
              fileId: 'content-fid-del',
            },
          ],
        },
      };
      mockRepo.findOne.mockResolvedValue(solWithMedia);

      await service.remove('sol-del-1');

      expect(mockRepo.remove).toHaveBeenCalledWith(solWithMedia);
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'thumb-fid-del',
      );
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'content-fid-del',
      );
    });
  });

  // ========================================================================
  // 2. PUBLIC ACCESS CONTROL & DRAFT PRIVACY
  // ========================================================================
  describe('2. Public Access Control & Draft Privacy', () => {
    it('blocks unpublished solution drafts from public findOne with NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        publicController.findOne('giai-phap-chua-xuat-ban'),
      ).rejects.toThrow(NotFoundException);
    });

    it('exposes solution drafts to admin endpoints (findById and findOneBySlug with adminMode)', async () => {
      const draftSol = {
        id: 'sol-draft-admin',
        slug: 'giai-phap-chua-xuat-ban',
        isPublished: false,
        content: { version: 1, blocks: [] },
      };
      mockRepo.findOne.mockResolvedValue(draftSol);

      const byId = await service.findById('sol-draft-admin');
      expect(byId.id).toBe('sol-draft-admin');

      const bySlug = await service.findOneBySlug(
        'giai-phap-chua-xuat-ban',
        true,
      );
      expect(bySlug.id).toBe('sol-draft-admin');
    });

    it('ensures public findAll strictly queries is_published = true', async () => {
      const mockQb: any = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockRepo.createQueryBuilder.mockReturnValue(mockQb);

      await publicController.findAll({ page: 1, limit: 10 });

      expect(mockQb.where).toHaveBeenCalledWith('s.is_published = true');
    });

    it('ensures findAllAdmin strictly selects s.content so editor never loses content on reload', async () => {
      const mockQb: any = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [
            {
              id: 'sol-1',
              title: 'Test',
              content: {
                version: 1,
                blocks: [{ id: 'b1', type: 'paragraph', text: 'Persistent' }],
              },
            },
          ],
          1,
        ]),
      };
      mockRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.findAllAdmin({ page: 1, limit: 10 });

      expect(mockQb.select).toHaveBeenCalledWith(
        expect.arrayContaining(['s.content', 's.id', 's.title', 's.slug']),
      );
      expect(result.items[0].content).toBeDefined();
    });

    it('ensures publicController.findOneAdmin exposes solution details by ID with content', async () => {
      const fullSol = {
        id: 'sol-full-id',
        title: 'Full Solution',
        content: {
          version: 1,
          blocks: [{ id: 'b1', type: 'paragraph', text: 'Hello' }],
        },
      };
      mockRepo.findOne.mockResolvedValue(fullSol);

      const res = await publicController.findOneAdmin('sol-full-id');
      expect(res.id).toBe('sol-full-id');
      expect(res.content).toBeDefined();
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'sol-full-id' },
        relations: { field: true },
      });
    });
  });

  // ========================================================================
  // 3. DOCUMENT VALIDATION & SECURITY
  // ========================================================================
  describe('3. Document Validation & XSS Prevention', () => {
    it('validates compliant 9 block types (heading, paragraph, image, list, ordered_list, quote, highlight, section, cta)', () => {
      const completeDoc: DocumentContent = {
        version: 1,
        blocks: [
          { id: 'h1', type: 'heading', level: 1, text: 'Tiêu đề H1' },
          { id: 'h2', type: 'heading', level: 2, text: 'Tiêu đề H2' },
          { id: 'p1', type: 'paragraph', text: 'Nội dung đoạn văn.' },
          {
            id: 'img1',
            type: 'image',
            url: 'https://ik.imagekit.io/vdcd/solutions/demo.jpg',
            alt: 'Demo giải pháp',
            caption: 'Chú thích hình ảnh',
            fileId: 'fid_123',
          },
          {
            id: 'l1',
            type: 'list',
            items: [
              'Mục thường 1',
              {
                text: 'Mục có cấp con',
                children: [
                  {
                    id: 'sub_l1',
                    type: 'list',
                    items: ['Mục con 1.1', 'Mục con 1.2'],
                  },
                ],
              },
            ],
          },
          { id: 'ol1', type: 'ordered_list', items: ['Bước 1', 'Bước 2'] },
          { id: 'q1', type: 'quote', text: 'Trích dẫn lãnh đạo' },
          { id: 'hl1', type: 'highlight', text: 'Điểm nhấn quan trọng' },
          { id: 'cta1', type: 'cta', label: 'Tư Vấn Ngay', url: '/lien-he' },
        ],
      };

      expect(() => validateDocumentContent(completeDoc)).not.toThrow();
    });

    it('strictly rejects malicious XSS tags and event handlers', () => {
      const xssDoc = {
        version: 1,
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            text: 'Mã độc <script>alert("hack")</script>',
          },
        ],
      };
      expect(() => validateDocumentContent(xssDoc)).toThrow(
        BadRequestException,
      );

      const eventHandlerDoc = {
        version: 1,
        blocks: [
          {
            id: 'b2',
            type: 'paragraph',
            text: '<img src="x" onerror="evilCode()" />',
          },
        ],
      };
      expect(() => validateDocumentContent(eventHandlerDoc)).toThrow(
        BadRequestException,
      );
    });

    it('strictly rejects duplicate block IDs across document tree', () => {
      const dupDoc = {
        version: 1,
        blocks: [
          { id: 'id-trung', type: 'paragraph', text: 'Đoạn 1' },
          { id: 'id-trung', type: 'paragraph', text: 'Đoạn 2 trùng ID' },
        ],
      };
      expect(() => validateDocumentContent(dupDoc)).toThrow(
        BadRequestException,
      );
    });
  });

  // ========================================================================
  // 4. IMAGEKIT FOLDER STRATEGY & SLUG MOVE
  // ========================================================================
  describe('4. ImageKit Folder Strategy & Slug Move', () => {
    it('triggers moveFolder when temporary folder key was used during create', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await service.create({
        title: 'Giải pháp Mới Tạo',
        slug: 'giai-phap-moi-tao',
        tempFolderKey: 'solution-a8f39c2d',
        content: { version: 1, blocks: [] },
      });

      expect(mockUploadService.moveFolder).toHaveBeenCalledWith(
        '/vdcd/solutions/solution-a8f39c2d',
        '/vdcd/solutions/giai-phap-moi-tao',
      );
    });

    it('triggers moveFolder when slug changes during update', async () => {
      const existing = {
        id: 'sol-rename-1',
        title: 'Giải pháp Đổi Slug',
        slug: 'giai-phap-slug-cu',
        content: { version: 1, blocks: [] },
      };
      mockRepo.findOne.mockImplementation(
        (entityOrOptions: any, maybeOptions?: any) => {
          const options = maybeOptions || entityOrOptions;
          if (options?.where?.id) return Promise.resolve(existing);
          return Promise.resolve(null);
        },
      );

      await service.update('sol-rename-1', {
        slug: 'giai-phap-slug-moi',
      });

      expect(mockUploadService.moveFolder).toHaveBeenCalledWith(
        '/vdcd/solutions/giai-phap-slug-cu',
        '/vdcd/solutions/giai-phap-slug-moi',
      );
    });
  });

  // ========================================================================
  // 5. REGRESSION & SHARED CONTRACT ASSURANCE
  // ========================================================================
  describe('5. Regression & Shared Contract Assurance', () => {
    it('ensures DocumentContent version matches CURRENT_DOCUMENT_VERSION (1)', () => {
      expect(CURRENT_DOCUMENT_VERSION).toBe(1);
    });

    it('converts legacy rich text without losing text, headings, or images', () => {
      const sampleLegacyHtml = `
        <h2>Khảo sát nhu cầu tự động hóa</h2>
        <p>Trung tâm phối hợp với các cơ quan thực hiện khảo sát chi tiết.</p>
        <figure>
          <img src="https://ik.imagekit.io/vdcd/solutions/robot.jpg" alt="Robot công nghiệp" />
          <figcaption>Học viên tham gia thực hành.</figcaption>
        </figure>
        <div class="project-style-cta">
          <h3>Đăng ký chuyển giao</h3>
          <p>Điền thông tin vào phiếu đăng ký để nhận thông báo.</p>
          <a href="/contact">ĐĂNG KÝ NGAY</a>
        </div>
      `;

      const converted = convertSolutionHtmlToBlocks(sampleLegacyHtml);

      expect(converted.version).toBe(1);
      expect(converted.blocks).toHaveLength(6);
      expect(converted.blocks[0]).toMatchObject({
        type: 'heading',
        level: 2,
        text: 'Khảo sát nhu cầu tự động hóa',
      });
      expect(converted.blocks[1]).toMatchObject({ type: 'paragraph' });
      expect(converted.blocks[2]).toMatchObject({
        type: 'image',
        caption: 'Học viên tham gia thực hành.',
      });
      expect(converted.blocks[3]).toMatchObject({
        type: 'heading',
        level: 3,
        text: 'Đăng ký chuyển giao',
      });
      expect(converted.blocks[5]).toMatchObject({
        type: 'cta',
        label: 'ĐĂNG KÝ NGAY',
        url: '/contact',
      });

      expect(() => validateDocumentContent(converted)).not.toThrow();
    });
  });
});
