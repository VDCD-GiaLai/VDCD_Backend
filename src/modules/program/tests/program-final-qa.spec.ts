// src/modules/program/tests/program-final-qa.spec.ts
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ProgramService } from '../program.service';
import { AdminProgramController } from '../admin-program.controller';
import { ProgramController } from '../program.controller';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';
import { convertProgramHtmlToBlocks } from '../utils/html-to-blocks.util';
import { DocumentContent } from '../../../common/types/document-content.types';

describe('PHASE 10: Program Backend QA & Regression Test Suite', () => {
  let service: ProgramService;
  let adminController: AdminProgramController;
  let publicController: ProgramController;
  let mockRepo: any;
  let mockArticleRepo: any;
  let mockUploadService: any;
  let mockDataSource: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ ...dto, id: 'prg-qa-uuid-1' })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue(undefined),
      createQueryBuilder: jest.fn(),
    };

    mockArticleRepo = {
      find: jest.fn().mockResolvedValue([]),
    };

    mockUploadService = {
      confirmUpload: jest.fn().mockResolvedValue(undefined),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    mockDataSource = {
      transaction: jest.fn((cb) =>
        cb({
          findOne: mockRepo.findOne,
          save: mockRepo.save,
        }),
      ),
    };

    service = new ProgramService(
      mockRepo,
      mockArticleRepo,
      mockUploadService,
      mockDataSource,
    );

    adminController = new AdminProgramController(service);
    publicController = new ProgramController(service);
  });

  // ========================================================================
  // MATRIX 1 & 9: METADATA & CRUD API LIFECYCLE
  // ========================================================================
  describe('1 & 9. Program Metadata & CRUD API Lifecycle', () => {
    it('creates a program with complete metadata and validated document content', async () => {
      mockRepo.findOne.mockResolvedValue(null); // Slug is unique

      const dto = {
        title: 'Chương trình Ươm tạo Khởi nghiệp Công nghệ',
        slug: 'uom-tao-khoi-nghiep-cong-nghe',
        shortDescription:
          'Hỗ trợ startup công nghệ từ ý tưởng đến thương mại hóa.',
        thumbnail: 'https://ik.imagekit.io/vdcd/uom-tao.jpg',
        thumbnailFileId: 'file_thumb_123',
        fieldId: 'field-uuid-01',
        metaTitle: 'Ươm tạo Khởi nghiệp VDCD',
        metaDescription: 'Chương trình ươm tạo hàng đầu tại Gia Lai',
        isPublished: true,
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'heading',
              level: 1,
              text: 'Tổng quan chương trình',
            },
            {
              id: 'b2',
              type: 'paragraph',
              text: 'Nội dung chi tiết chương trình ươm tạo.',
            },
            {
              id: 'b3',
              type: 'image',
              url: 'https://ik.imagekit.io/vdcd/startup.jpg',
              alt: 'Đội ngũ startup',
              caption: 'Hình ảnh lễ ra mắt',
              fileId: 'fid_startup_1',
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
        'file_thumb_123',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'fid_startup_1',
      );
    });

    it('rejects duplicate slug on create', async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 'existing-id',
        slug: 'da-ton-tai',
      });

      await expect(
        service.create({
          title: 'Chương trình Trùng Slug',
          slug: 'da-ton-tai',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('updates program metadata, cleans up replaced thumbnail and orphan content images', async () => {
      const existingProgram = {
        id: 'prg-qa-uuid-1',
        title: 'Tên Cũ',
        slug: 'ten-cu',
        thumbnail: 'https://ik.imagekit.io/vdcd/old-thumb.jpg',
        thumbnailFileId: 'old-thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: 'https://ik.imagekit.io/old1.jpg',
              fileId: 'img-fid-1',
              alt: '1',
            },
            {
              id: 'b2',
              type: 'image',
              url: 'https://ik.imagekit.io/old2.jpg',
              fileId: 'img-fid-2',
              alt: '2',
            },
          ],
        },
      };

      mockRepo.findOne.mockResolvedValue(existingProgram);

      const updateDto = {
        title: 'Tên Mới Cập Nhật',
        thumbnail: 'https://ik.imagekit.io/vdcd/new-thumb.jpg',
        thumbnailFileId: 'new-thumb-fid',
        content: {
          version: 1,
          blocks: [
            // Retains img-fid-1, removes img-fid-2, adds img-fid-3
            {
              id: 'b1',
              type: 'image',
              url: 'https://ik.imagekit.io/old1.jpg',
              fileId: 'img-fid-1',
              alt: '1',
            },
            {
              id: 'b3',
              type: 'image',
              url: 'https://ik.imagekit.io/new3.jpg',
              fileId: 'img-fid-3',
              alt: '3',
            },
          ],
        },
      };

      await service.update('prg-qa-uuid-1', updateDto);

      // Cleans up old thumbnail
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'old-thumb-fid',
      );
      // Cleans up orphaned content image (img-fid-2)
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith('img-fid-2');
      // Confirms new thumbnail and new content image
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'new-thumb-fid',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith('img-fid-3');
    });

    it('toggles publish status and manages publishedAt timestamp', async () => {
      const unpublishedProgram = {
        id: 'prg-1',
        isPublished: false,
        publishedAt: null,
      };
      mockRepo.findOne.mockResolvedValue(unpublishedProgram);

      // 1. Publish
      const published = await service.togglePublish('prg-1', true);
      expect(published.isPublished).toBe(true);
      expect(published.publishedAt).toBeInstanceOf(Date);

      // 2. Unpublish
      mockRepo.findOne.mockResolvedValue({
        id: 'prg-1',
        isPublished: true,
        publishedAt: new Date(),
      });
      const unpublished = await service.togglePublish('prg-1', false);
      expect(unpublished.isPublished).toBe(false);
      expect(unpublished.publishedAt).toBeNull();
    });

    it('deletes a program and cleans up all associated media files', async () => {
      const programWithMedia = {
        id: 'prg-del',
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
      mockRepo.findOne.mockResolvedValue(programWithMedia);

      await service.remove('prg-del');

      expect(mockRepo.remove).toHaveBeenCalledWith(programWithMedia);
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'thumb-fid-del',
      );
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'content-fid-del',
      );
    });
  });

  // ========================================================================
  // MATRIX 9: PUBLIC VS ADMIN VISIBILITY (ACCESS CONTROL & RBAC)
  // ========================================================================
  describe('9. Access Control & Draft Visibility', () => {
    it('blocks drafts from public findOneBySlug with NotFoundException', async () => {
      // Mock draft program in repo
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        publicController.findOne('chuong-trinh-nhap'),
      ).rejects.toThrow(NotFoundException);
    });

    it('exposes drafts to admin findById and findOneBySlug with adminMode = true', async () => {
      const draftProgram = {
        id: 'prg-draft-1',
        slug: 'chuong-trinh-nhap',
        isPublished: false,
        content: { version: 1, blocks: [] },
      };
      mockRepo.findOne.mockResolvedValue(draftProgram);

      const byId = await service.findById('prg-draft-1');
      expect(byId.id).toBe('prg-draft-1');

      const bySlug = await service.findOneBySlug('chuong-trinh-nhap', true);
      expect(bySlug.id).toBe('prg-draft-1');
    });

    it('public findAll queryBuilder only queries is_published = true', async () => {
      const mockQb: any = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockRepo.createQueryBuilder.mockReturnValue(mockQb);

      await publicController.findAll({ page: 1, limit: 10 });

      expect(mockQb.where).toHaveBeenCalledWith('p.is_published = true');
    });
  });

  // ========================================================================
  // MATRIX 2 & 4: DOCUMENT CONTENT VALIDATION & NO RAW CSS INJECTION
  // ========================================================================
  describe('2 & 4. Document Content Validation & Security', () => {
    it('validates all 9 block types (heading, paragraph, image, list, ordered_list, quote, highlight, section, cta)', () => {
      const allBlocksDoc: DocumentContent = {
        version: 1,
        blocks: [
          { id: 'h1', type: 'heading', level: 1, text: 'H1 Title' },
          { id: 'h2', type: 'heading', level: 2, text: 'H2 Title' },
          { id: 'p1', type: 'paragraph', text: 'Paragraph Text' },
          {
            id: 'img1',
            type: 'image',
            url: 'https://example.com/pic.jpg',
            alt: 'Alt',
            caption: 'Cap',
          },
          { id: 'l1', type: 'list', items: ['Item 1', 'Item 2'] },
          { id: 'ol1', type: 'ordered_list', items: ['Step 1', 'Step 2'] },
          { id: 'q1', type: 'quote', text: 'A wise quote' },
          { id: 'hl1', type: 'highlight', text: 'Key highlight' },
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: 'Sec Title',
            children: [],
          },
          { id: 'cta1', type: 'cta', label: 'Click Me', url: '/link' },
        ],
      };

      expect(() => validateDocumentContent(allBlocksDoc)).not.toThrow();
    });

    it('strictly rejects raw scripts and XSS event handlers in block text', () => {
      const xssDoc = {
        version: 1,
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            text: 'Safe <script>alert(1)</script>',
          },
        ],
      };
      expect(() => validateDocumentContent(xssDoc)).toThrow(
        BadRequestException,
      );

      const eventHandlerDoc = {
        version: 1,
        blocks: [
          { id: 'b2', type: 'paragraph', text: '<img src=x onerror=alert(1)>' },
        ],
      };
      expect(() => validateDocumentContent(eventHandlerDoc)).toThrow(
        BadRequestException,
      );
    });

    it('strictly rejects duplicate block IDs across the document', () => {
      const dupIdDoc = {
        version: 1,
        blocks: [
          { id: 'same-id', type: 'paragraph', text: 'First block' },
          { id: 'same-id', type: 'paragraph', text: 'Second block duplicate' },
        ],
      };
      expect(() => validateDocumentContent(dupIdDoc)).toThrow(
        BadRequestException,
      );
    });
  });

  // ========================================================================
  // MATRIX 10: REGRESSION ASSURANCE
  // ========================================================================
  describe('10. Regression Assurance', () => {
    it('ensures convertProgramHtmlToBlocks converts legacy HTML without losing text, headings, or images', () => {
      const sampleLegacyHtml = `
        <h2>Khảo sát nhu cầu đào tạo</h2>
        <p>Trung tâm phối hợp với các cơ quan thực hiện khảo sát chi tiết.</p>
        <div class="my-8 rounded-2xl">
          <img src="https://ik.imagekit.io/test.jpg" alt="Ảnh lớp học" />
          <p class="italic">Học viên tham gia thực hành.</p>
        </div>
        <div class="project-style-cta border p-6">
          <h3>Đăng ký khóa học</h3>
          <p>Điền thông tin vào phiếu đăng ký để nhận thông báo.</p>
          <div class="flex gap-4">
            <a href="/contact">ĐĂNG KÝ NGAY</a>
            <a href="/solutions">XEM GIẢI PHÁP</a>
          </div>
        </div>
      `;

      const converted = convertProgramHtmlToBlocks(sampleLegacyHtml);

      expect(converted.version).toBe(1);
      expect(converted.blocks.length).toBe(7);
      expect(converted.blocks[0]).toMatchObject({
        type: 'heading',
        text: 'Khảo sát nhu cầu đào tạo',
        level: 2,
      });
      expect(converted.blocks[1]).toMatchObject({ type: 'paragraph' });
      expect(converted.blocks[2]).toMatchObject({
        type: 'image',
        caption: 'Học viên tham gia thực hành.',
      });
      expect(converted.blocks[3]).toMatchObject({
        type: 'heading',
        text: 'Đăng ký khóa học',
        level: 3,
      });
      expect(converted.blocks[4]).toMatchObject({ type: 'paragraph' });
      expect(converted.blocks[5]).toMatchObject({
        type: 'cta',
        label: 'ĐĂNG KÝ NGAY',
        url: '/contact',
      });
      expect(converted.blocks[6]).toMatchObject({
        type: 'cta',
        label: 'XEM GIẢI PHÁP',
        url: '/solutions',
      });
    });
  });
});
