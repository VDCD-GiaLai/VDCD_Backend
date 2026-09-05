// src/modules/article/tests/article-database.spec.ts
import { convertHtmlToBlocks } from '../utils/html-to-blocks.util';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';

describe('Article HTML to Block Converter (Phase 03 Database Refactor)', () => {
  it('should return empty DocumentContent when input is empty or null', () => {
    expect(convertHtmlToBlocks(null)).toEqual({ version: 1, blocks: [] });
    expect(convertHtmlToBlocks('')).toEqual({ version: 1, blocks: [] });
    expect(convertHtmlToBlocks('   ')).toEqual({ version: 1, blocks: [] });
  });

  it('should convert standard paragraphs', () => {
    const html =
      '<p class="text-base">Đoạn văn thứ nhất.</p><p>Đoạn văn thứ hai.</p>';
    const doc = convertHtmlToBlocks(html);
    validateDocumentContent(doc);

    expect(doc.blocks).toHaveLength(2);
    expect(doc.blocks[0]).toMatchObject({
      type: 'paragraph',
      text: 'Đoạn văn thứ nhất.',
    });
    expect(doc.blocks[1]).toMatchObject({
      type: 'paragraph',
      text: 'Đoạn văn thứ hai.',
    });
  });

  it('should convert headings preserving levels', () => {
    const html = '<h1>Tiêu đề H1</h1><h2>Tiêu đề H2</h2><h3>Tiêu đề H3</h3>';
    const doc = convertHtmlToBlocks(html);
    validateDocumentContent(doc);

    expect(doc.blocks).toHaveLength(3);
    expect(doc.blocks[0]).toMatchObject({
      type: 'heading',
      level: 1,
      text: 'Tiêu đề H1',
    });
    expect(doc.blocks[1]).toMatchObject({
      type: 'heading',
      level: 2,
      text: 'Tiêu đề H2',
    });
    expect(doc.blocks[2]).toMatchObject({
      type: 'heading',
      level: 3,
      text: 'Tiêu đề H3',
    });
  });

  it('should convert lists (ul and ol)', () => {
    const html = `
      <ul>
        <li>Điểm 1</li>
        <li>Điểm 2</li>
      </ul>
      <ol>
        <li>Bước A</li>
        <li>Bước B</li>
      </ol>
    `;
    const doc = convertHtmlToBlocks(html);
    validateDocumentContent(doc);

    expect(doc.blocks).toHaveLength(2);
    expect(doc.blocks[0]).toMatchObject({
      type: 'list',
      items: ['Điểm 1', 'Điểm 2'],
    });
    expect(doc.blocks[1]).toMatchObject({
      type: 'ordered_list',
      items: ['Bước A', 'Bước B'],
    });
  });

  it('should convert figure with image and caption', () => {
    const html = `
      <figure class="my-6">
        <img src="https://example.com/banner.jpg" alt="Lễ ký kết" />
        <figcaption>Quang cảnh buổi lễ ký kết</figcaption>
      </figure>
    `;
    const doc = convertHtmlToBlocks(html);
    validateDocumentContent(doc);

    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0]).toMatchObject({
      type: 'image',
      url: 'https://example.com/banner.jpg',
      alt: 'Lễ ký kết',
      caption: 'Quang cảnh buổi lễ ký kết',
    });
  });

  it('should convert blockquote to quote block', () => {
    const html =
      '<blockquote>Trí tuệ nhân tạo là động lực số của tương lai.</blockquote>';
    const doc = convertHtmlToBlocks(html);
    validateDocumentContent(doc);

    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0]).toMatchObject({
      type: 'quote',
      text: 'Trí tuệ nhân tạo là động lực số của tương lai.',
    });
  });

  it('should convert complex real-world article markup without dropping content', () => {
    const html = `
      <p>Mở đầu bài viết về chuyển đổi số Tây Nguyên.</p>
      <h2>Trọng tâm chiến lược</h2>
      <ul>
        <li>Hạ tầng số</li>
        <li>Nhân lực AI</li>
      </ul>
      <figure>
        <img src="https://ik.imagekit.io/vdcd/ai.webp" alt="AI Lab" />
        <figcaption>Phòng thí nghiệm AI</figcaption>
      </figure>
      <p>Kết luận bài viết.</p>
    `;

    const doc = convertHtmlToBlocks(html);
    const validated = validateDocumentContent(doc);

    expect(validated.blocks).toHaveLength(5);
    expect(validated.blocks.map((b) => b.type)).toEqual([
      'paragraph',
      'heading',
      'list',
      'image',
      'paragraph',
    ]);
  });
});
