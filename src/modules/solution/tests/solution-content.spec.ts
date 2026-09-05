// src/modules/solution/tests/solution-content.spec.ts
import { ConflictException, BadRequestException } from '@nestjs/common';
import { convertSolutionHtmlToBlocks } from '../utils/html-to-blocks.util';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';
import { SolutionService } from '../solution.service';

describe('Solution Content & Document Architecture Tests', () => {
  describe('HTML to Blocks Converter (convertSolutionHtmlToBlocks)', () => {
    it('should convert empty, null, or undefined HTML to empty blocks document', () => {
      expect(convertSolutionHtmlToBlocks('')).toEqual({
        version: 1,
        blocks: [],
      });
      expect(convertSolutionHtmlToBlocks(null)).toEqual({
        version: 1,
        blocks: [],
      });
      expect(convertSolutionHtmlToBlocks(undefined)).toEqual({
        version: 1,
        blocks: [],
      });
    });

    it('should convert headings h1 to h6 preserving levels and text', () => {
      const html = '<h1>Title 1</h1><h2>Title 2</h2><h3>Title 3</h3>';
      const doc = convertSolutionHtmlToBlocks(html);
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
        '<p class="text-base leading-relaxed">Nội dung <strong>giải pháp</strong> công nghệ số.</p>';
      const doc = convertSolutionHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'paragraph',
        text: 'Nội dung giải pháp công nghệ số.',
      });
    });

    it('should parse custom image card with image and caption', () => {
      const html = `
        <div class="my-8 rounded-2xl overflow-hidden border border-zinc-200">
          <img src="https://ik.imagekit.io/test/solution-img.png" alt="Sơ đồ giải pháp" class="w-full" />
          <p class="text-sm italic">Kiến trúc tổng thể giải pháp</p>
        </div>
      `;
      const doc = convertSolutionHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'image',
        url: 'https://ik.imagekit.io/test/solution-img.png',
        alt: 'Sơ đồ giải pháp',
        caption: 'Kiến trúc tổng thể giải pháp',
      });
    });

    it('should parse figure element with figcaption', () => {
      const html = `
        <figure>
          <img src="https://ik.imagekit.io/test/fig1.jpg" alt="Mô phỏng 3D" />
          <figcaption>Hình ảnh quét trắc địa 3D</figcaption>
        </figure>
      `;
      const doc = convertSolutionHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'image',
        url: 'https://ik.imagekit.io/test/fig1.jpg',
        alt: 'Mô phỏng 3D',
        caption: 'Hình ảnh quét trắc địa 3D',
      });
    });

    it('should parse unordered and ordered lists', () => {
      const html = `
        <ul>
          <li>Mục 1</li>
          <li>Mục 2</li>
        </ul>
        <ol>
          <li>Bước 1</li>
          <li>Bước 2</li>
        </ol>
      `;
      const doc = convertSolutionHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(2);
      expect(doc.blocks[0]).toMatchObject({
        type: 'list',
        items: ['Mục 1', 'Mục 2'],
      });
      expect(doc.blocks[1]).toMatchObject({
        type: 'ordered_list',
        items: ['Bước 1', 'Bước 2'],
      });
    });

    it('should parse blockquote element', () => {
      const html =
        '<blockquote>Giải pháp mang tính đột phá cho vùng Tây Nguyên.</blockquote>';
      const doc = convertSolutionHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'quote',
        text: 'Giải pháp mang tính đột phá cho vùng Tây Nguyên.',
      });
    });

    it('should parse complex CTA container into Heading, Paragraph, and CTA blocks', () => {
      const html = `
        <div class="project-style-cta my-12 p-8 bg-zinc-900 rounded-3xl">
          <div class="max-w-xl">
            <h3 class="text-2xl font-bold text-white">Sẵn sàng ứng dụng giải pháp?</h3>
            <p class="text-zinc-400">Liên hệ với đội ngũ chuyên gia của chúng tôi.</p>
            <div class="flex gap-4">
              <a href="/contact" class="btn-primary">Đăng ký tư vấn</a>
              <a href="/solutions" class="btn-secondary">Tìm hiểu thêm</a>
            </div>
          </div>
        </div>
      `;
      const doc = convertSolutionHtmlToBlocks(html);
      expect(doc.blocks).toHaveLength(4);
      expect(doc.blocks[0]).toMatchObject({
        type: 'heading',
        level: 3,
        text: 'Sẵn sàng ứng dụng giải pháp?',
      });
      expect(doc.blocks[1]).toMatchObject({
        type: 'paragraph',
        text: 'Liên hệ với đội ngũ chuyên gia của chúng tôi.',
      });
      expect(doc.blocks[2]).toMatchObject({
        type: 'cta',
        label: 'Đăng ký tư vấn',
        url: '/contact',
      });
      expect(doc.blocks[3]).toMatchObject({
        type: 'cta',
        label: 'Tìm hiểu thêm',
        url: '/solutions',
      });
    });

    it('should fall back to paragraph for plain text without losing data', () => {
      const text = 'Nội dung văn bản thuần túy không có thẻ HTML nào.';
      const doc = convertSolutionHtmlToBlocks(text);
      expect(doc.blocks).toHaveLength(1);
      expect(doc.blocks[0]).toMatchObject({
        type: 'paragraph',
        text: 'Nội dung văn bản thuần túy không có thẻ HTML nào.',
      });
    });
  });

  describe('Document Validation with Solution Documents', () => {
    it('should validate compliant DocumentContent', () => {
      const validDoc = {
        version: 1,
        blocks: [
          {
            id: 'h-1',
            type: 'heading',
            level: 2,
            text: 'Tiêu đề giải pháp',
          },
          {
            id: 'p-1',
            type: 'paragraph',
            text: 'Mô tả chi tiết giải pháp',
          },
          {
            id: 'img-1',
            type: 'image',
            url: 'https://ik.imagekit.io/test/sol.jpg',
            fileId: 'fid-123',
            alt: 'Ảnh giải pháp',
            caption: 'Mô tả hình ảnh',
          },
          {
            id: 'cta-1',
            type: 'cta',
            label: 'Đăng ký',
            url: '/contact',
          },
        ],
      };
      expect(() => validateDocumentContent(validDoc)).not.toThrow();
    });

    it('should throw BadRequestException on malicious script injections in Solution document', () => {
      const unsafeDoc = {
        version: 1,
        blocks: [
          {
            id: 'p-1',
            type: 'paragraph',
            text: 'Nội dung chứa <script>alert("xss")</script>',
          },
        ],
      };
      expect(() => validateDocumentContent(unsafeDoc)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException on duplicate block IDs', () => {
      const dupDoc = {
        version: 1,
        blocks: [
          { id: 'dup-id', type: 'paragraph', text: 'Đoạn 1' },
          { id: 'dup-id', type: 'paragraph', text: 'Đoạn 2' },
        ],
      };
      expect(() => validateDocumentContent(dupDoc)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('Solution Service CRUD & Image Lifecycle', () => {
    let service: SolutionService;
    let mockSolutionRepo: any;
    let mockArticleRepo: any;
    let mockUploadService: any;
    let mockDataSource: any;
    let mockEntityManager: any;

    beforeEach(() => {
      const mockQb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      };
      mockSolutionRepo = {
        findOne: jest.fn(),
        create: jest.fn((dto) => ({ id: 'sol-uuid-1', ...dto })),
        save: jest.fn((entity) =>
          Promise.resolve({ id: 'sol-uuid-1', ...entity }),
        ),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        remove: jest.fn().mockResolvedValue(undefined),
        createQueryBuilder: jest.fn(() => mockQb),
      };

      mockArticleRepo = {
        find: jest.fn().mockResolvedValue([]),
      };

      mockUploadService = {
        confirmUpload: jest.fn().mockResolvedValue(undefined),
        deleteFile: jest.fn().mockResolvedValue(undefined),
        moveFolder: jest.fn().mockResolvedValue(true),
        cleanOrphanFiles: jest.fn().mockResolvedValue(undefined),
      };

      mockEntityManager = {
        findOne: jest.fn(),
        save: jest.fn((entity) => Promise.resolve(entity)),
      };

      mockDataSource = {
        transaction: jest.fn((cb) => cb(mockEntityManager)),
        query: jest.fn().mockResolvedValue([{ count: 0 }]),
      };

      service = new SolutionService(
        mockSolutionRepo,
        mockArticleRepo,
        mockUploadService,
        mockDataSource,
      );
    });

    it('should create solution, validate content, and confirm thumbnail + block images', async () => {
      mockSolutionRepo.findOne.mockResolvedValue(null);

      const dto = {
        title: 'Giải pháp nông nghiệp',
        thumbnail: 'https://ik.imagekit.io/test/thumb.jpg',
        thumbnailFileId: 'thumb-fid-1',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-b1',
              type: 'image',
              url: 'https://ik.imagekit.io/test/block.jpg',
              fileId: 'block-fid-1',
              alt: 'Ảnh minh họa',
            },
          ],
        },
      };

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockSolutionRepo.save).toHaveBeenCalled();
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'thumb-fid-1',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'block-fid-1',
      );
    });

    it('should throw ConflictException on duplicate slug during create', async () => {
      mockSolutionRepo.findOne.mockResolvedValue({
        id: 'existing-id',
        slug: 'giai-phap-test',
      });

      await expect(
        service.create({
          title: 'Giải pháp test',
          slug: 'giai-phap-test',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should update solution, diff images, cleanup orphans, and confirm new images', async () => {
      const existingSolution = {
        id: 'sol-uuid-1',
        title: 'Giải pháp cũ',
        slug: 'giai-phap-cu',
        thumbnail: 'https://ik.imagekit.io/test/old-thumb.jpg',
        thumbnailFileId: 'old-thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-1',
              type: 'image',
              url: 'https://ik.imagekit.io/test/img1.jpg',
              fileId: 'img-fid-to-delete',
              alt: 'Ảnh sẽ bị xóa',
            },
            {
              id: 'img-2',
              type: 'image',
              url: 'https://ik.imagekit.io/test/img2.jpg',
              fileId: 'img-fid-retained',
              alt: 'Ảnh giữ lại',
            },
          ],
        },
      };

      mockEntityManager.findOne.mockResolvedValue(existingSolution);

      const updateDto = {
        thumbnail: 'https://ik.imagekit.io/test/new-thumb.jpg',
        thumbnailFileId: 'new-thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-2',
              type: 'image',
              url: 'https://ik.imagekit.io/test/img2.jpg',
              fileId: 'img-fid-retained',
              alt: 'Ảnh giữ lại',
            },
            {
              id: 'img-3',
              type: 'image',
              url: 'https://ik.imagekit.io/test/img3.jpg',
              fileId: 'new-img-fid',
              alt: 'Ảnh mới thêm',
            },
          ],
        },
      };

      await service.update('sol-uuid-1', updateDto);

      // Old replaced thumbnail should be deleted
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'old-thumb-fid',
      );
      // Orphaned block image should be deleted
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'img-fid-to-delete',
      );
      // Retained image should NOT be deleted
      expect(mockUploadService.deleteFile).not.toHaveBeenCalledWith(
        'img-fid-retained',
      );
      // New thumbnail and new image should be confirmed
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'new-thumb-fid',
      );
      expect(mockUploadService.confirmUpload).toHaveBeenCalledWith(
        'new-img-fid',
      );
    });

    it('should find solution by ID for admin', async () => {
      const mockSol = {
        id: 'sol-123',
        title: 'Giải pháp A',
        isPublished: false,
      };
      mockSolutionRepo.findOne.mockResolvedValue(mockSol);

      const result = await service.findById('sol-123');
      expect(result).toEqual(mockSol);
      expect(mockSolutionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'sol-123' },
        relations: { field: true },
      });
    });

    it('should toggle publish status and synchronize publishedAt timestamp', async () => {
      mockSolutionRepo.findOne.mockResolvedValue({
        id: 'sol-123',
        isPublished: false,
      });

      const res = await service.togglePublish('sol-123', true);
      expect(res.isPublished).toBe(true);
      expect(res.publishedAt).toBeInstanceOf(Date);
      expect(mockSolutionRepo.update).toHaveBeenCalledWith(
        'sol-123',
        expect.objectContaining({ isPublished: true }),
      );
    });

    it('should remove solution and delete both thumbnail and inline content images from ImageKit', async () => {
      const solutionToDelete = {
        id: 'sol-123',
        thumbnailFileId: 'thumb-to-del',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-1',
              type: 'image',
              fileId: 'content-img-1',
              url: 'https://ik.imagekit.io/test/1.jpg',
            },
            {
              id: 'img-2',
              type: 'image',
              fileId: 'content-img-2',
              url: 'https://ik.imagekit.io/test/2.jpg',
            },
          ],
        },
      };

      mockSolutionRepo.findOne.mockResolvedValue(solutionToDelete);

      await service.remove('sol-123');

      expect(mockUploadService.deleteFile).toHaveBeenCalledWith('thumb-to-del');
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'content-img-1',
      );
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'content-img-2',
      );
      expect(mockSolutionRepo.remove).toHaveBeenCalledWith(solutionToDelete);
    });
    it('should preserve shared media when fileId is used by another entity (Case 5)', async () => {
      const solutionToDelete = {
        id: 'sol-123',
        thumbnailFileId: 'shared-thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img-1',
              type: 'image',
              fileId: 'shared-content-fid',
              url: 'https://ik.imagekit.io/test/shared.jpg',
            },
          ],
        },
      };

      mockSolutionRepo.findOne.mockResolvedValue(solutionToDelete);
      // Simulate that this media is shared with another entity (article count > 0)
      mockDataSource.query = jest.fn().mockResolvedValue([{ count: 1 }]);

      await service.remove('sol-123');

      // deleteFile must NOT be called because media is shared!
      expect(mockUploadService.deleteFile).not.toHaveBeenCalledWith(
        'shared-thumb-fid',
      );
      expect(mockUploadService.deleteFile).not.toHaveBeenCalledWith(
        'shared-content-fid',
      );
      expect(mockSolutionRepo.remove).toHaveBeenCalledWith(solutionToDelete);
    });
  });
});
