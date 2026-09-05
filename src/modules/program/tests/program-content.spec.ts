// src/modules/program/tests/program-content.spec.ts
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { convertProgramHtmlToBlocks } from '../utils/html-to-blocks.util';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';
import { ProgramService } from '../program.service';

describe('Program Content & Document Architecture Tests', () => {
  describe('HTML to Blocks Converter (convertProgramHtmlToBlocks)', () => {
    it('should convert empty, null, or undefined HTML to empty blocks document', () => {
      expect(convertProgramHtmlToBlocks('')).toEqual({
        version: 1,
        blocks: [],
      });
      expect(convertProgramHtmlToBlocks(null)).toEqual({
        version: 1,
        blocks: [],
      });
      expect(convertProgramHtmlToBlocks(undefined)).toEqual({
        version: 1,
        blocks: [],
      });
    });

    it('should convert headings h1 to h6 preserving levels and text', () => {
      const html = '<h1>Title 1</h1><h2>Title 2</h2><h3>Title 3</h3>';
      const doc = convertProgramHtmlToBlocks(html);
      expect(doc.version).toBe(1);
      expect(doc.blocks).toHaveLength(3);
      expect(doc.blocks[0]).toMatchObject({
        type: 'heading',
        level: 1,
        text: 'Title 1',
      });
      expect(doc.blocks[1]).toMatchObject({
        type: 'heading',
        level: 2,
        text: 'Title 2',
      });
      expect(doc.blocks[2]).toMatchObject({
        type: 'heading',
        level: 3,
        text: 'Title 3',
      });
    });

    it('should convert paragraphs and clean inner tags', () => {
      const html =
        '<p class="text-base leading-relaxed">Nội dung <strong>chương trình</strong> số hóa.</p>';
      const doc = convertProgramHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'paragraph',
        text: 'Nội dung chương trình số hóa.',
      });
    });

    it('should parse custom image card with image and caption', () => {
      const html = `
        <div class="my-8 rounded-2xl overflow-hidden border border-zinc-200">
          <img src="https://ik.imagekit.io/test/img1.png" alt="Lễ ký kết" class="w-full" />
          <p class="text-sm italic">Hình ảnh lễ ký kết hợp tác</p>
        </div>
      `;
      const doc = convertProgramHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'image',
        url: 'https://ik.imagekit.io/test/img1.png',
        alt: 'Lễ ký kết',
        caption: 'Hình ảnh lễ ký kết hợp tác',
      });
    });

    it('should parse project-style-cta container into CTA blocks', () => {
      const html = `
        <div class="project-style-cta border bg-zinc-50 p-8 text-center my-12">
          <div class="flex items-center justify-center">Ươm tạo</div>
          <h3 class="text-2xl font-bold">Bắt đầu từ dự án của bạn</h3>
          <p class="text-zinc-600">Gửi hồ sơ dự án để được hỗ trợ.</p>
          <div class="flex gap-4">
            <a href="/contact" class="program-cta-btn cta-btn-primary">GỬI HỒ SƠ</a>
            <a href="/solutions" class="program-cta-btn cta-btn-secondary">XEM GIẢI PHÁP</a>
          </div>
        </div>
      `;
      const doc = convertProgramHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(4);
      expect(doc.blocks[0]).toMatchObject({
        type: 'heading',
        level: 3,
        text: 'Bắt đầu từ dự án của bạn',
      });
      expect(doc.blocks[1]).toMatchObject({
        type: 'paragraph',
        text: 'Gửi hồ sơ dự án để được hỗ trợ.',
      });
      expect(doc.blocks[2]).toMatchObject({
        type: 'cta',
        label: 'GỬI HỒ SƠ',
        url: '/contact',
      });
      expect(doc.blocks[3]).toMatchObject({
        type: 'cta',
        label: 'XEM GIẢI PHÁP',
        url: '/solutions',
      });
    });

    it('should parse lists and quotes', () => {
      const html = `
        <ul>
          <li>Mục 1</li>
          <li>Mục 2</li>
        </ul>
        <blockquote>Đổi mới sáng tạo là chìa khóa phát triển.</blockquote>
      `;
      const doc = convertProgramHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(2);
      expect(doc.blocks[0]).toMatchObject({
        type: 'list',
        items: ['Mục 1', 'Mục 2'],
      });
      expect(doc.blocks[1]).toMatchObject({
        type: 'quote',
        text: 'Đổi mới sáng tạo là chìa khóa phát triển.',
      });
    });
  });

  describe('Document Content Validation Rules', () => {
    it('should validate a compliant document successfully', () => {
      const validDoc = {
        version: 1,
        blocks: [
          { id: 'blk-1', type: 'heading', level: 2, text: 'Tiêu đề' },
          { id: 'blk-2', type: 'paragraph', text: 'Nội dung' },
          {
            id: 'blk-3',
            type: 'image',
            url: 'https://example.com/img.jpg',
            alt: 'Ảnh minh họa',
            caption: 'Chú thích ảnh',
          },
        ],
      };
      expect(() => validateDocumentContent(validDoc)).not.toThrow();
    });

    it('should reject document without version or blocks', () => {
      expect(() => validateDocumentContent({ blocks: [] })).toThrow(
        BadRequestException,
      );
      expect(() => validateDocumentContent({ version: 1 })).toThrow(
        BadRequestException,
      );
      expect(() => validateDocumentContent('invalid string')).toThrow(
        BadRequestException,
      );
    });

    it('should reject XSS script in text content', () => {
      const unsafeDoc = {
        version: 1,
        blocks: [
          {
            id: 'blk-xss',
            type: 'paragraph',
            text: '<script>alert("hack")</script>',
          },
        ],
      };
      expect(() => validateDocumentContent(unsafeDoc)).toThrow(
        BadRequestException,
      );
    });

    it('should strictly reject title, subtitle, or excerpt inside ImageBlock', () => {
      const invalidImageDoc = {
        version: 1,
        blocks: [
          {
            id: 'blk-img-bad',
            type: 'image',
            url: 'https://example.com/img.jpg',
            alt: 'Ảnh',
            title: 'Không được phép có title',
          },
        ],
      };
      expect(() => validateDocumentContent(invalidImageDoc)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('ProgramService Business Logic & Access Control', () => {
    let service: ProgramService;
    let mockRepo: any;
    let mockArticleRepo: any;
    let mockUploadService: any;
    let mockDataSource: any;

    beforeEach(() => {
      mockRepo = {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn((dto) => ({ ...dto, id: 'prg-uuid-1' })),
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
    });

    it('should create program with validated document and set publishedAt when isPublished is true', async () => {
      mockRepo.findOne.mockResolvedValue(null); // slug available

      const dto = {
        title: 'Chương trình năng lượng số',
        isPublished: true,
        content: {
          version: 1,
          blocks: [
            { id: 'b1', type: 'paragraph', text: 'Giới thiệu' },
            {
              id: 'b2',
              type: 'image',
              url: 'https://ik.imagekit.io/test/a.jpg',
              alt: 'Test',
              fileId: 'fid-1',
            },
          ],
        },
        thumbnailFileId: 'thumb-fid-1',
      };

      const result = await service.create(dto);
      expect(result.id).toBe('prg-uuid-1');
      expect(result.publishedAt).toBeInstanceOf(Date);
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'thumb-fid-1',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith('fid-1');
    });

    it('should reject create if slug already exists', async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 'other-id',
        slug: 'da-ton-tai',
      });

      await expect(
        service.create({
          title: 'Trùng slug',
          slug: 'da-ton-tai',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should not expose draft program to public findOneBySlug', async () => {
      // Return null when queried with isPublished: true
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findOneBySlug('chuong-trinh-nhap', false),
      ).rejects.toThrow(NotFoundException);
    });

    it('should expose draft program to admin findById', async () => {
      const draftProgram = {
        id: 'prg-draft-1',
        title: 'Chương trình nháp',
        isPublished: false,
        publishedAt: null,
        content: { version: 1, blocks: [] },
      };
      mockRepo.findOne.mockResolvedValue(draftProgram);

      const result = await service.findById('prg-draft-1');
      expect(result).toEqual(draftProgram);
      expect(result.isPublished).toBe(false);
    });

    it('should toggle publish and update publishedAt timestamp', async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 'prg-1',
        isPublished: false,
        publishedAt: null,
      });

      const res = await service.togglePublish('prg-1', true);
      expect(res.isPublished).toBe(true);
      expect(res.publishedAt).toBeInstanceOf(Date);
      expect(mockRepo.update).toHaveBeenCalledWith('prg-1', {
        isPublished: true,
        publishedAt: expect.any(Date),
      });
    });

    it('should clean up orphan images from ImageKit on update', async () => {
      const existingProgram = {
        id: 'prg-1',
        thumbnail: 'thumb.jpg',
        thumbnailFileId: 'thumb-1',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: 'u1',
              fileId: 'img-to-keep',
              alt: 'k',
            },
            {
              id: 'b2',
              type: 'image',
              url: 'u2',
              fileId: 'img-to-delete',
              alt: 'd',
            },
          ],
        },
      };
      mockRepo.findOne.mockResolvedValue(existingProgram);

      const updateDto = {
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: 'u1',
              fileId: 'img-to-keep',
              alt: 'k',
            },
            {
              id: 'b3',
              type: 'image',
              url: 'u3',
              fileId: 'new-img-added',
              alt: 'n',
            },
          ],
        },
      };

      await service.update('prg-1', updateDto);
      // img-to-delete should be deleted from ImageKit
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'img-to-delete',
      );
      // new-img-added should be confirmed on ImageKit
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'new-img-added',
      );
    });
  });
});
