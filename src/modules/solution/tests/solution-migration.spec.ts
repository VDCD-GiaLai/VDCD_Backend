// src/modules/solution/tests/solution-migration.spec.ts
import {
  convertSolutionHtmlToBlocks,
  convertSolutionHtmlWithReport,
} from '../utils/html-to-blocks.util';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';
import {
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  ListBlock,
  OrderedListBlock,
  ListItem,
} from '../../../common/types/document-content.types';

describe('PHASE 10: Solution Legacy Content Migration & Converter Tests', () => {
  describe('1. Heading Mapping (h1 - h6)', () => {
    it('converts h1 through h6 preserving semantic levels and text hierarchy', () => {
      const html = `
        <h1>Tiêu đề Cấp 1</h1>
        <h2>Tiêu đề Cấp 2</h2>
        <h3>Tiêu đề Cấp 3</h3>
        <h4>Tiêu đề Cấp 4</h4>
        <h5>Tiêu đề Cấp 5</h5>
        <h6>Tiêu đề Cấp 6</h6>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.document.blocks).toHaveLength(6);
      expect(result.stats.headings.total).toBe(6);
      expect(result.stats.headings.h1).toBe(1);
      expect(result.stats.headings.h2).toBe(1);
      expect(result.stats.headings.h3).toBe(1);
      expect(result.stats.headings.h4).toBe(1);
      expect(result.stats.headings.h5).toBe(1);
      expect(result.stats.headings.h6).toBe(1);

      for (let i = 1; i <= 6; i++) {
        const block = result.document.blocks[i - 1] as HeadingBlock;
        expect(block.type).toBe('heading');
        expect(block.level).toBe(i);
        expect(block.text).toBe(`Tiêu đề Cấp ${i}`);
      }

      // Validates with generic document validator
      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });
  });

  describe('2. Paragraph Mapping (<p>)', () => {
    it('converts <p> tags, decodes HTML entities and strips inline tags safely', () => {
      const html = `
        <p>Đây là một đoạn văn bản với <strong>chữ đậm</strong>, <em>in nghiêng</em> và &amp; ký tự đặc biệt.</p>
        <p>Đoạn văn bản thứ hai &lt;thông tin&gt; &quot;VDCD&quot;.</p>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.document.blocks).toHaveLength(2);
      expect(result.stats.paragraphs).toBe(2);

      const p1 = result.document.blocks[0] as ParagraphBlock;
      expect(p1.type).toBe('paragraph');
      expect(p1.text).toBe(
        'Đây là một đoạn văn bản với chữ đậm, in nghiêng và & ký tự đặc biệt.',
      );

      const p2 = result.document.blocks[1] as ParagraphBlock;
      expect(p2.text).toBe('Đoạn văn bản thứ hai <thông tin> "VDCD".');

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });
  });

  describe('3. Lists and Nested Lists (<ul>, <ol>, <li>)', () => {
    it('converts single-level unordered and ordered lists', () => {
      const html = `
        <ul>
          <li>Mục không thứ tự A</li>
          <li>Mục không thứ tự B</li>
        </ul>
        <ol>
          <li>Bước thực hiện 1</li>
          <li>Bước thực hiện 2</li>
        </ol>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.document.blocks).toHaveLength(2);
      expect(result.stats.lists).toBe(1);
      expect(result.stats.orderedLists).toBe(1);

      const ulBlock = result.document.blocks[0] as ListBlock;
      expect(ulBlock.type).toBe('list');
      expect(ulBlock.items).toEqual([
        'Mục không thứ tự A',
        'Mục không thứ tự B',
      ]);

      const olBlock = result.document.blocks[1] as OrderedListBlock;
      expect(olBlock.type).toBe('ordered_list');
      expect(olBlock.items).toEqual(['Bước thực hiện 1', 'Bước thực hiện 2']);

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });

    it('converts nested lists into item.children[] preserving parent-child hierarchy', () => {
      const html = `
        <ul>
          <li>Mục cha 1</li>
          <li>Mục cha 2 với danh sách con
            <ul>
              <li>Mục con 2.1</li>
              <li>Mục con 2.2</li>
            </ul>
          </li>
          <li>Mục cha 3</li>
        </ul>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.document.blocks).toHaveLength(1);
      expect(result.stats.lists).toBe(2);
      expect(result.stats.nestedLists).toBe(1);

      const rootList = result.document.blocks[0] as ListBlock;
      expect(rootList.type).toBe('list');
      expect(rootList.items).toHaveLength(3);

      expect(rootList.items[0]).toBe('Mục cha 1');
      expect(rootList.items[2]).toBe('Mục cha 3');

      // Nested item at index 1
      const nestedItem = rootList.items[1] as ListItem;
      expect(typeof nestedItem).toBe('object');
      expect(nestedItem.text).toBe('Mục cha 2 với danh sách con');
      expect(nestedItem.children).toBeDefined();
      expect(nestedItem.children).toHaveLength(1);

      const childList = nestedItem.children![0] as ListBlock;
      expect(childList.type).toBe('list');
      expect(childList.items).toEqual(['Mục con 2.1', 'Mục con 2.2']);

      // Must validate cleanly through document content validator
      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });

    it('converts multi-tier mixed nested lists (ul inside ol inside ul)', () => {
      const html = `
        <ol>
          <li>Giai đoạn chuẩn bị
            <ul>
              <li>Khảo sát hiện trường
                <ol>
                  <li>Đo đạc GPS</li>
                  <li>Bay chụp UAV</li>
                </ol>
              </li>
              <li>Thu thập dữ liệu</li>
            </ul>
          </li>
          <li>Giai đoạn triển khai</li>
        </ol>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.document.blocks).toHaveLength(1);

      const rootList = result.document.blocks[0] as OrderedListBlock;
      expect(rootList.type).toBe('ordered_list');

      const stage1 = rootList.items[0] as ListItem;
      expect(stage1.text).toBe('Giai đoạn chuẩn bị');
      expect(stage1.children).toHaveLength(1);

      const tier2List = stage1.children![0] as ListBlock;
      expect(tier2List.type).toBe('list');

      const subSurvey = tier2List.items[0] as ListItem;
      expect(subSurvey.text).toBe('Khảo sát hiện trường');
      expect(subSurvey.children).toHaveLength(1);

      const tier3List = subSurvey.children![0] as OrderedListBlock;
      expect(tier3List.type).toBe('ordered_list');
      expect(tier3List.items).toEqual(['Đo đạc GPS', 'Bay chụp UAV']);

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });
  });

  describe('4. Image & Caption Extraction (<img>, <figure>)', () => {
    it('extracts ImageBlock with caption from <figure> without leaking Solution metadata', () => {
      const html = `
        <figure>
          <img src="https://ik.imagekit.io/vdcd/solutions/gis/map-view.png" alt="Bản đồ GIS 3D" />
          <figcaption>Hình 1: Mô hình trắc địa địa hình 3D tỉnh Gia Lai</figcaption>
        </figure>
      `;

      const result = convertSolutionHtmlWithReport(html, {
        title: 'Giải pháp GIS',
        slug: 'giai-phap-gis',
      });

      expect(result.document.blocks).toHaveLength(1);
      const imgBlock = result.document.blocks[0] as ImageBlock;
      expect(imgBlock.type).toBe('image');
      expect(imgBlock.url).toBe(
        'https://ik.imagekit.io/vdcd/solutions/gis/map-view.png',
      );
      expect(imgBlock.alt).toBe('Bản đồ GIS 3D');
      expect(imgBlock.caption).toBe(
        'Hình 1: Mô hình trắc địa địa hình 3D tỉnh Gia Lai',
      );

      // Verify Solution metadata is NEVER transferred into ImageBlock
      expect((imgBlock as any).title).toBeUndefined();
      expect((imgBlock as any).shortDescription).toBeUndefined();
      expect((imgBlock as any).slug).toBeUndefined();
      expect((imgBlock as any).websiteUrl).toBeUndefined();

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });

    it('extracts ImageBlock with caption from custom image card container', () => {
      const html = `
        <div class="my-8 rounded-2xl overflow-hidden border">
          <img src="https://ik.imagekit.io/vdcd/sensor.jpg" alt="Cảm biến IoT" />
          <p class="italic text-sm">Cảm biến nhiệt độ và độ ẩm không khí.</p>
        </div>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.document.blocks).toHaveLength(1);
      const imgBlock = result.document.blocks[0] as ImageBlock;
      expect(imgBlock.type).toBe('image');
      expect(imgBlock.url).toBe('https://ik.imagekit.io/vdcd/sensor.jpg');
      expect(imgBlock.caption).toBe('Cảm biến nhiệt độ và độ ẩm không khí.');

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });
  });

  describe('5. Unsupported Content Preservation & Non-Destructive Fallback', () => {
    it('preserves text inside unsupported HTML elements (table, iframe, video, div) and logs warnings', () => {
      const html = `
        <table>
          <tr><td>Cột 1</td><td>Cột 2</td></tr>
        </table>
        <iframe src="https://example.com/embed"></iframe>
        <div class="custom-card">Nội dung thẻ div đặc biệt.</div>
      `;

      const result = convertSolutionHtmlWithReport(html);
      expect(result.stats.unsupportedTags).toEqual(
        expect.arrayContaining(['table', 'iframe', 'div']),
      );
      expect(result.warnings.length).toBeGreaterThan(0);

      // Verify text from table and div are preserved
      const texts = result.document.blocks.map(
        (b) => (b as ParagraphBlock).text,
      );
      expect(texts.some((t) => t && t.includes('Cột 1'))).toBe(true);
      expect(
        texts.some((t) => t && t.includes('Nội dung thẻ div đặc biệt')),
      ).toBe(true);

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });

    it('falls back to paragraph for plain text strings without losing characters', () => {
      const plainText =
        'Giải pháp tích hợp công nghệ số hóa dữ liệu cho nông nghiệp thông minh tại Tây Nguyên.';
      const result = convertSolutionHtmlWithReport(plainText);

      expect(result.document.blocks).toHaveLength(1);
      const pBlock = result.document.blocks[0] as ParagraphBlock;
      expect(pBlock.type).toBe('paragraph');
      expect(pBlock.text).toBe(plainText);

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });
  });

  describe('6. Edge Cases & Resilience', () => {
    it('handles empty, null, undefined strings gracefully returning empty blocks', () => {
      expect(convertSolutionHtmlToBlocks(null).blocks).toHaveLength(0);
      expect(convertSolutionHtmlToBlocks(undefined).blocks).toHaveLength(0);
      expect(convertSolutionHtmlToBlocks('').blocks).toHaveLength(0);
      expect(convertSolutionHtmlToBlocks('   ').blocks).toHaveLength(0);
    });

    it('handles mixed legacy rich-text document with headings, paragraphs, nested lists, images, and CTAs', () => {
      const complexHtml = `
        <h2>Tổng quan Giải pháp Năng lượng Thông minh</h2>
        <p>Giải pháp giám sát và tối ưu hóa tiêu thụ điện năng cho nhà máy thông minh.</p>
        <figure>
          <img src="https://ik.imagekit.io/vdcd/energy-architecture.png" alt="Sơ đồ kiến trúc" />
          <figcaption>Hình 1: Kiến trúc thu thập dữ liệu IoT</figcaption>
        </figure>
        <blockquote>Tiết kiệm đến 25% chi phí điện năng ngay trong năm đầu tiên.</blockquote>
        <ul>
          <li>Lợi ích then chốt
            <ul>
              <li>Giám sát tức thời</li>
              <li>Cảnh báo vượt ngưỡng tự động</li>
            </ul>
          </li>
          <li>Tương thích chuẩn IEC 61850</li>
        </ul>
        <div class="project-style-cta">
          <h3>Đăng ký khảo sát</h3>
          <p>Liên hệ đội ngũ kỹ sư VDCD để được tư vấn lộ trình triển khai.</p>
          <a href="/contact">LIÊN HỆ NGAY</a>
        </div>
      `;

      const result = convertSolutionHtmlWithReport(complexHtml);
      expect(result.document.blocks.length).toBeGreaterThanOrEqual(6);
      expect(result.stats.headings.h2).toBe(1);
      expect(result.stats.paragraphs).toBeGreaterThanOrEqual(2);
      expect(result.stats.images).toBe(1);
      expect(result.stats.quotes).toBe(1);
      expect(result.stats.nestedLists).toBe(1);
      expect(result.stats.ctas).toBe(1);

      expect(() => validateDocumentContent(result.document)).not.toThrow();
    });
  });
});
