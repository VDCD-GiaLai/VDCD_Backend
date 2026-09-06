// src/common/validators/document-content.validator.spec.ts
import {
  validateDocumentContent,
  extractImageFileIds,
} from './document-content.validator';
import { DocumentContent } from '../types/document-content.types';

describe('DocumentContent Validator (Phase 04)', () => {
  // ── 1. Valid Document Structures ─────────────────────────────────
  describe('Valid documents', () => {
    it('should accept valid empty document', () => {
      const doc: DocumentContent = { version: 1, blocks: [] };
      const result = validateDocumentContent(doc);
      expect(result).toEqual(doc);
    });

    it('should accept document with all supported block types', () => {
      const doc: DocumentContent = {
        version: 1,
        blocks: [
          {
            id: 'h1',
            type: 'heading',
            level: 1,
            text: 'Heading 1',
            fontSize: '4xl',
          },
          {
            id: 'h2',
            type: 'heading',
            level: 2,
            text: 'Heading 2',
            fontSize: '3xl',
          },
          {
            id: 'h6',
            type: 'heading',
            level: 6,
            text: 'Heading 6',
            fontSize: 'sm',
          },
          { id: 'p1', type: 'paragraph', text: 'Paragraph content' },
          {
            id: 'img1',
            type: 'image',
            url: 'https://example.com/cover.webp',
            fileId: 'fid-123',
            alt: 'Alternative text',
            caption: 'Image caption',
          },
          {
            id: 'img2',
            type: 'image',
            url: 'https://example.com/media.webp',
            mediaId: 'mid-456',
            alt: 'Media alias image',
            caption: null,
          },
          {
            id: 'ls1',
            type: 'list',
            items: ['Item 1', 'Item 2'],
          },
          {
            id: 'ols1',
            type: 'ordered_list',
            items: ['Step 1', 'Step 2'],
          },
          {
            id: 'q1',
            type: 'quote',
            text: 'Innovation distinguishes between a leader and a follower.',
            author: 'Steve Jobs',
            citation: 'Apple Inc.',
          },
          {
            id: 'hl1',
            type: 'highlight',
            text: 'Key highlight notice',
            style: 'info',
          },
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: 'Section Overview',
            children: [
              { id: 'sec-p1', type: 'paragraph', text: 'Section child text' },
              {
                id: 'sec-img1',
                type: 'image',
                url: 'https://example.com/sec.png',
                fileId: 'fid-sec-1',
                alt: 'Section image',
                caption: null,
              },
            ],
          },
          {
            id: 'cta1',
            type: 'cta',
            label: 'Explore Solutions',
            url: '/solutions/data',
          },
        ],
      };

      const result = validateDocumentContent(doc);
      expect(result.blocks).toHaveLength(12);
    });
  });

  // ── 2. Heading Validation (H1-H6) ────────────────────────────────
  describe('Heading block validation', () => {
    it.each([1, 2, 3, 4, 5, 6])('should accept heading level H%i', (level) => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: `h-${level}`,
            type: 'heading',
            level,
            text: `Heading ${level}`,
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).not.toThrow();
    });

    it('should reject heading level 0', () => {
      const doc = {
        version: 1,
        blocks: [{ id: 'h0', type: 'heading', level: 0, text: 'Invalid' }],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'level phải là số nguyên từ 1 đến 6',
      );
    });

    it('should reject heading level 7 (H7+)', () => {
      const doc = {
        version: 1,
        blocks: [
          { id: 'h7', type: 'heading', level: 7, text: 'H7 is not supported' },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'level phải là số nguyên từ 1 đến 6',
      );
    });

    it('should reject heading with empty text or whitespace only', () => {
      const doc = {
        version: 1,
        blocks: [{ id: 'h-empty', type: 'heading', level: 2, text: '   ' }],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'HeadingBlock.text không được để trống',
      );
    });

    it('should reject heading with non-string fontSize', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'h-size',
            type: 'heading',
            level: 2,
            text: 'Valid',
            fontSize: 123,
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'HeadingBlock.fontSize phải là string',
      );
    });
  });

  // ── 3. Image Block Validation ────────────────────────────────────
  describe('Image block validation', () => {
    it('should strictly reject image block with title, subtitle, or excerpt', () => {
      const withTitle = {
        version: 1,
        blocks: [
          {
            id: 'img-title',
            type: 'image',
            url: 'https://example.com/img.jpg',
            alt: 'Alt',
            title: 'Forbidden title in image',
          },
        ],
      };
      expect(() => validateDocumentContent(withTitle)).toThrow(
        'ImageBlock không được chứa thuộc tính "title"',
      );

      const withSubtitle = {
        version: 1,
        blocks: [
          {
            id: 'img-sub',
            type: 'image',
            url: 'https://example.com/img.jpg',
            alt: 'Alt',
            subtitle: 'Forbidden subtitle',
          },
        ],
      };
      expect(() => validateDocumentContent(withSubtitle)).toThrow(
        'ImageBlock không được chứa thuộc tính "subtitle"',
      );

      const withExcerpt = {
        version: 1,
        blocks: [
          {
            id: 'img-exc',
            type: 'image',
            url: 'https://example.com/img.jpg',
            alt: 'Alt',
            excerpt: 'Forbidden excerpt',
          },
        ],
      };
      expect(() => validateDocumentContent(withExcerpt)).toThrow(
        'ImageBlock không được chứa thuộc tính "excerpt"',
      );
    });

    it('should reject image with empty url', () => {
      const doc = {
        version: 1,
        blocks: [{ id: 'img-nourl', type: 'image', url: '', alt: 'Alt' }],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'ImageBlock.url không được để trống',
      );
    });
  });

  // ── 4. Recursive List Validation ─────────────────────────────────
  describe('List & OrderedList recursive validation', () => {
    it('should accept multi-level nested lists via children', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'list-root',
            type: 'list',
            items: ['Level 1 Item A', 'Level 1 Item B'],
            children: [
              {
                id: 'list-child-1',
                type: 'ordered_list',
                items: ['Level 2 Item 1', 'Level 2 Item 2'],
                children: [
                  {
                    id: 'list-child-2',
                    type: 'list',
                    items: ['Level 3 Sub-item'],
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).not.toThrow();
    });

    it('should accept nested list items with individual children', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'list-item-nested',
            type: 'list',
            items: [
              'Normal item',
              {
                text: 'Parent item with sublist',
                children: [
                  {
                    id: 'sub-list',
                    type: 'ordered_list',
                    items: ['Child ordered item'],
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).not.toThrow();
    });

    it('should reject list with empty items and no children', () => {
      const doc = {
        version: 1,
        blocks: [{ id: 'empty-list', type: 'list', items: [] }],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'ListBlock.items phải là array không rỗng',
      );
    });

    it('should reject list containing empty item strings', () => {
      const doc = {
        version: 1,
        blocks: [
          { id: 'bad-list-item', type: 'list', items: ['Valid', '   '] },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Item phải là string không rỗng',
      );
    });
  });

  // ── 5. Security & Sanitization ───────────────────────────────────
  describe('Security and dangerous content rejection', () => {
    it('should reject script tags in text', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'p-xss',
            type: 'paragraph',
            text: 'Hello <script>alert("hacked")</script> world',
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Chứa nội dung không an toàn hoặc mã thực thi nguy hiểm',
      );
    });

    it('should reject javascript: protocol in URL', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'cta-evil',
            type: 'cta',
            label: 'Click here',
            url: 'javascript:stealCookies()',
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Chứa nội dung không an toàn hoặc mã thực thi nguy hiểm',
      );
    });

    it('should reject inline event handlers (onload, onerror, onclick)', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'p-event',
            type: 'paragraph',
            text: '<img src="x" onerror=alert(1)>',
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Chứa nội dung không an toàn hoặc mã thực thi nguy hiểm',
      );
    });

    it('should reject iframe injection', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'q-evil',
            type: 'quote',
            text: '<iframe src="https://attacker.com"></iframe>',
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Chứa nội dung không an toàn hoặc mã thực thi nguy hiểm',
      );
    });
  });

  // ── 6. Malformed Documents ───────────────────────────────────────
  describe('Malformed documents', () => {
    it('should reject non-object root', () => {
      expect(() => validateDocumentContent(null)).toThrow(
        'Content phải là object',
      );
      expect(() => validateDocumentContent('string')).toThrow(
        'Content phải là object',
      );
      expect(() => validateDocumentContent([1, 2, 3])).toThrow(
        'Content phải là object',
      );
    });

    it('should reject missing or invalid version', () => {
      expect(() => validateDocumentContent({ blocks: [] })).toThrow(
        'Content phải có field "version"',
      );
      expect(() => validateDocumentContent({ version: 0, blocks: [] })).toThrow(
        'Content version phải là số nguyên >= 1',
      );
      expect(() =>
        validateDocumentContent({ version: 999, blocks: [] }),
      ).toThrow('không được hỗ trợ');
    });

    it('should reject duplicate block IDs', () => {
      const doc = {
        version: 1,
        blocks: [
          { id: 'dup-1', type: 'paragraph', text: 'Text A' },
          { id: 'dup-1', type: 'paragraph', text: 'Text B' },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Block id "dup-1" bị trùng lặp',
      );
    });

    it('should reject unsupported block types', () => {
      const doc = {
        version: 1,
        blocks: [{ id: 'unknown-1', type: 'audio', url: 'https://sound.mp3' }],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'Block type "audio" không hợp lệ',
      );
    });
  });

  // ── 7. Image Extraction ──────────────────────────────────────────
  describe('extractImageFileIds', () => {
    it('should extract fileIds and mediaIds from top-level and nested blocks', () => {
      const doc: DocumentContent = {
        version: 1,
        blocks: [
          {
            id: 'i1',
            type: 'image',
            url: 'https://example.com/1.jpg',
            fileId: 'fid-1',
            alt: 'Alt 1',
          },
          {
            id: 'i2',
            type: 'image',
            url: 'https://example.com/2.jpg',
            mediaId: 'mid-2',
            alt: 'Alt 2',
          },
          {
            id: 's1',
            type: 'section',
            title: 'Sec',
            children: [
              {
                id: 'si1',
                type: 'image',
                url: 'https://example.com/sec1.jpg',
                fileId: 'fid-sec-1',
                alt: 'Alt Sec',
              },
            ],
          },
        ],
      };

      const ids = extractImageFileIds(doc);
      expect(ids).toEqual(['fid-1', 'mid-2', 'fid-sec-1']);
    });
  });

  // ── 8. Phase 02 Shared Model: Spacing & HeroMeta ─────────────────
  describe('Phase 02 Shared Document Model: Spacing & HeroMeta', () => {
    it('should validate document with heroMeta and block spacing', () => {
      const doc = {
        version: 1,
        heroMeta: {
          placement: 'between_title_desc',
          position: 'center',
          caption: 'Ảnh đại diện dự án VDCD',
        },
        blocks: [
          {
            id: 'h-1',
            type: 'heading',
            level: 2,
            text: 'Tổng quan giải pháp & dự án',
            spacing: { marginTop: 24, marginBottom: 16 },
          },
          {
            id: 'p-1',
            type: 'paragraph',
            text: 'Nội dung mô tả chi tiết dự án thực tế.',
            spacing: { marginTop: 8, marginBottom: 16 },
          },
          {
            id: 'img-1',
            type: 'image',
            url: 'https://ik.imagekit.io/vdcd/projects/lotte-mall/cover.webp',
            fileId: 'fid-lotte-1',
            alt: 'Lotte Mall Project',
            caption: 'Toàn cảnh dự án',
            spacing: { marginTop: 20, marginBottom: 20 },
          },
        ],
      };

      const validated = validateDocumentContent(doc);
      expect(validated.heroMeta?.placement).toBe('between_title_desc');
      expect(validated.blocks[0].spacing?.marginTop).toBe(24);
    });

    it('should reject invalid heroMeta placement', () => {
      const doc = {
        version: 1,
        heroMeta: {
          placement: 'invalid_placement',
        },
        blocks: [],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'heroMeta.placement không hợp lệ',
      );
    });

    it('should reject negative block spacing values', () => {
      const doc = {
        version: 1,
        blocks: [
          {
            id: 'p-neg',
            type: 'paragraph',
            text: 'Test',
            spacing: { marginTop: -10 },
          },
        ],
      };
      expect(() => validateDocumentContent(doc)).toThrow(
        'blocks[0].spacing.marginTop phải là số không âm',
      );
    });
  });
});
