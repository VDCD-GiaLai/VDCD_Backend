// src/modules/slide-detail-blog/validators/content.validator.spec.ts
import { validateBlogContent, extractImageFileIds } from './content.validator';
import { BlogContent } from '../types/blog-content.types';

describe('validateBlogContent', () => {
  // ── Valid content ──────────────────────────────────────────────

  it('should accept valid empty content', () => {
    const content = { version: 1, blocks: [] };
    const result = validateBlogContent(content);
    expect(result).toEqual(content);
  });

  it('should accept valid content with all block types', () => {
    const content = {
      version: 1,
      blocks: [
        { id: 'h1', type: 'heading', level: 2, text: 'Title' },
        { id: 'p1', type: 'paragraph', text: 'Some text' },
        {
          id: 'img1',
          type: 'image',
          url: 'https://example.com/img.jpg',
          fileId: 'file123',
          alt: 'Alt text',
          caption: 'Caption',
        },
        {
          id: 'ls1',
          type: 'list',
          items: ['Item 1', 'Item 2'],
        },
        {
          id: 'sec1',
          type: 'section',
          number: '01',
          title: 'Section Title',
          children: [
            { id: 'sp1', type: 'paragraph', text: 'Child paragraph' },
            {
              id: 'simg1',
              type: 'image',
              url: 'https://example.com/child.jpg',
              fileId: null,
              alt: 'Child alt',
              caption: null,
            },
          ],
        },
        { id: 'cta1', type: 'cta', label: 'Contact', url: '/contact' },
      ],
    };
    const result = validateBlogContent(content);
    expect(result.blocks).toHaveLength(6);
  });

  it('should accept heading level 3', () => {
    const content = {
      version: 1,
      blocks: [{ id: 'h1', type: 'heading', level: 3, text: 'H3' }],
    };
    expect(() => validateBlogContent(content)).not.toThrow();
  });

  it('should accept image with null fileId and null caption', () => {
    const content = {
      version: 1,
      blocks: [
        {
          id: 'img1',
          type: 'image',
          url: 'https://example.com/img.jpg',
          fileId: null,
          alt: 'Alt',
          caption: null,
        },
      ],
    };
    expect(() => validateBlogContent(content)).not.toThrow();
  });

  it('should accept section with empty children', () => {
    const content = {
      version: 1,
      blocks: [
        {
          id: 'sec1',
          type: 'section',
          number: '01',
          title: 'Title',
          children: [],
        },
      ],
    };
    expect(() => validateBlogContent(content)).not.toThrow();
  });

  // ── Invalid content root ───────────────────────────────────────

  it('should reject null content', () => {
    expect(() => validateBlogContent(null)).toThrow('Content phải là object');
  });

  it('should reject array content', () => {
    expect(() => validateBlogContent([])).toThrow('Content phải là object');
  });

  it('should reject string content', () => {
    expect(() => validateBlogContent('hello')).toThrow(
      'Content phải là object',
    );
  });

  // ── Invalid version ────────────────────────────────────────────

  it('should reject missing version', () => {
    expect(() => validateBlogContent({ blocks: [] })).toThrow(
      'Content phải có field "version"',
    );
  });

  it('should reject version 0', () => {
    expect(() => validateBlogContent({ version: 0, blocks: [] })).toThrow(
      'version phải là số nguyên >= 1',
    );
  });

  it('should reject version > current', () => {
    expect(() => validateBlogContent({ version: 99, blocks: [] })).toThrow(
      'không được hỗ trợ',
    );
  });

  it('should reject string version', () => {
    expect(() => validateBlogContent({ version: '1', blocks: [] })).toThrow(
      'version phải là số nguyên >= 1',
    );
  });

  // ── Invalid blocks ─────────────────────────────────────────────

  it('should reject missing blocks', () => {
    expect(() => validateBlogContent({ version: 1 })).toThrow(
      'blocks" là array',
    );
  });

  it('should reject blocks as string', () => {
    expect(() => validateBlogContent({ version: 1, blocks: 'hello' })).toThrow(
      'blocks" là array',
    );
  });

  // ── Invalid block: common ──────────────────────────────────────

  it('should reject block without id', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ type: 'paragraph', text: 'no id' }],
      }),
    ).toThrow('Block phải có "id"');
  });

  it('should reject block with empty id', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: '  ', type: 'paragraph', text: 'empty id' }],
      }),
    ).toThrow('Block phải có "id"');
  });

  it('should reject duplicate block ids', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          { id: 'dup', type: 'paragraph', text: 'first' },
          { id: 'dup', type: 'paragraph', text: 'second' },
        ],
      }),
    ).toThrow('bị trùng lặp');
  });

  it('should reject unknown block type', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'b1', type: 'unknown_type', text: 'foo' }],
      }),
    ).toThrow('không hợp lệ');
  });

  // ── Invalid heading ────────────────────────────────────────────

  it('should reject heading level 1', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'h1', type: 'heading', level: 1, text: 'H1' }],
      }),
    ).toThrow('level phải là 2 hoặc 3');
  });

  it('should reject heading level 4', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'h1', type: 'heading', level: 4, text: 'H4' }],
      }),
    ).toThrow('level phải là 2 hoặc 3');
  });

  it('should reject heading with empty text', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'h1', type: 'heading', level: 2, text: '' }],
      }),
    ).toThrow('text không được để trống');
  });

  // ── Invalid paragraph ──────────────────────────────────────────

  it('should reject paragraph with empty text', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'p1', type: 'paragraph', text: '' }],
      }),
    ).toThrow('text không được để trống');
  });

  it('should reject paragraph with whitespace-only text', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'p1', type: 'paragraph', text: '   ' }],
      }),
    ).toThrow('text không được để trống');
  });

  // ── Invalid image ──────────────────────────────────────────────

  it('should reject image with empty url', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'img1',
            type: 'image',
            url: '',
            fileId: null,
            alt: 'alt',
            caption: null,
          },
        ],
      }),
    ).toThrow('url không được để trống');
  });

  it('should reject image with number fileId', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'img1',
            type: 'image',
            url: 'https://example.com/img.jpg',
            fileId: 123,
            alt: 'alt',
            caption: null,
          },
        ],
      }),
    ).toThrow('fileId phải là string hoặc null');
  });

  // ── Invalid list ───────────────────────────────────────────────

  it('should reject list with empty items array', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'ls1', type: 'list', items: [] }],
      }),
    ).toThrow('items phải là array không rỗng');
  });

  it('should reject list with empty string item', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'ls1', type: 'list', items: ['valid', ''] }],
      }),
    ).toThrow('Item phải là string không rỗng');
  });

  // ── Invalid section ────────────────────────────────────────────

  it('should reject section with empty title', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: '',
            children: [],
          },
        ],
      }),
    ).toThrow('title không được để trống');
  });

  it('should reject section with empty number', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'sec1',
            type: 'section',
            number: '',
            title: 'Title',
            children: [],
          },
        ],
      }),
    ).toThrow('number không được để trống');
  });

  it('should reject section child with type "section" (no nesting)', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: 'Parent',
            children: [
              {
                id: 'sec2',
                type: 'section',
                number: '02',
                title: 'Nested',
                children: [],
              },
            ],
          },
        ],
      }),
    ).toThrow('không hợp lệ');
  });

  it('should reject section child with type "cta"', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: 'Parent',
            children: [
              { id: 'cta1', type: 'cta', label: 'Click', url: '/url' },
            ],
          },
        ],
      }),
    ).toThrow('không hợp lệ');
  });

  it('should reject section with invalid child block', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: 'Title',
            children: [
              { id: 'p1', type: 'paragraph', text: '' }, // empty text
            ],
          },
        ],
      }),
    ).toThrow('text không được để trống');
  });

  // ── Invalid CTA ────────────────────────────────────────────────

  it('should reject cta with empty label', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'cta1', type: 'cta', label: '', url: '/contact' }],
      }),
    ).toThrow('label không được để trống');
  });

  it('should reject cta with empty url', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [{ id: 'cta1', type: 'cta', label: 'Click', url: '' }],
      }),
    ).toThrow('url không được để trống');
  });

  // ── Duplicate IDs across blocks and section children ───────────

  it('should reject duplicate id between top-level and section child', () => {
    expect(() =>
      validateBlogContent({
        version: 1,
        blocks: [
          { id: 'shared_id', type: 'paragraph', text: 'top level' },
          {
            id: 'sec1',
            type: 'section',
            number: '01',
            title: 'Sec',
            children: [{ id: 'shared_id', type: 'paragraph', text: 'child' }],
          },
        ],
      }),
    ).toThrow('bị trùng lặp');
  });
});

describe('extractImageFileIds', () => {
  it('should extract fileIds from top-level images', () => {
    const content: BlogContent = {
      version: 1,
      blocks: [
        {
          id: 'img1',
          type: 'image',
          url: 'https://example.com/1.jpg',
          fileId: 'file_001',
          alt: 'A',
          caption: null,
        },
        { id: 'p1', type: 'paragraph', text: 'text' },
        {
          id: 'img2',
          type: 'image',
          url: 'https://example.com/2.jpg',
          fileId: 'file_002',
          alt: 'B',
          caption: null,
        },
      ],
    };
    expect(extractImageFileIds(content)).toEqual(['file_001', 'file_002']);
  });

  it('should extract fileIds from section children', () => {
    const content: BlogContent = {
      version: 1,
      blocks: [
        {
          id: 'sec1',
          type: 'section',
          number: '01',
          title: 'Sec',
          children: [
            {
              id: 'img1',
              type: 'image',
              url: 'https://example.com/child.jpg',
              fileId: 'file_child',
              alt: 'C',
              caption: null,
            },
          ],
        },
      ],
    };
    expect(extractImageFileIds(content)).toEqual(['file_child']);
  });

  it('should skip images with null fileId', () => {
    const content: BlogContent = {
      version: 1,
      blocks: [
        {
          id: 'img1',
          type: 'image',
          url: 'https://example.com/1.jpg',
          fileId: null,
          alt: 'A',
          caption: null,
        },
      ],
    };
    expect(extractImageFileIds(content)).toEqual([]);
  });

  it('should return empty array for content with no images', () => {
    const content: BlogContent = {
      version: 1,
      blocks: [{ id: 'p1', type: 'paragraph', text: 'no images here' }],
    };
    expect(extractImageFileIds(content)).toEqual([]);
  });
});
