// src/modules/solution/utils/html-to-blocks.util.ts
import { randomUUID } from 'crypto';
import {
  DocumentContent,
  ContentBlock,
  ListBlock,
  OrderedListBlock,
  ListItem,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';

export interface BlockStats {
  headings: {
    total: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  paragraphs: number;
  lists: number;
  orderedLists: number;
  nestedLists: number;
  images: number;
  quotes: number;
  ctas: number;
  unsupportedTags: string[];
}

export interface ConvertResult {
  document: DocumentContent;
  stats: BlockStats;
  warnings: string[];
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, '')).trim();
}

/**
 * Extract a balanced block for a tag that may be nested (e.g. <ul>, <ol>, <div>, <table>).
 */
function extractBalancedTag(
  html: string,
  startIndex: number,
  tagName: string,
): { fullBlock: string; endIndex: number } {
  const openTagRegex = new RegExp(`^<${tagName}\\b[^>]*>`, 'i');
  const slice = html.slice(startIndex);
  const openMatch = openTagRegex.exec(slice);
  if (!openMatch) {
    return { fullBlock: slice, endIndex: html.length };
  }

  let depth = 1;
  const tagScanner = new RegExp(`(</?${tagName}\\b[^>]*>)`, 'gi');
  tagScanner.lastIndex = openMatch[0].length;
  let m: RegExpExecArray | null;

  while ((m = tagScanner.exec(slice)) !== null) {
    const tag = m[1].toLowerCase();
    if (tag.startsWith(`</${tagName.toLowerCase()}`)) {
      depth--;
      if (depth === 0) {
        const endIndex = startIndex + tagScanner.lastIndex;
        return {
          fullBlock: html.slice(startIndex, endIndex),
          endIndex,
        };
      }
    } else if (!tag.endsWith('/>')) {
      depth++;
    }
  }

  return {
    fullBlock: html.slice(startIndex),
    endIndex: html.length,
  };
}

/**
 * Extract <li> items from list inner HTML respecting nested <ul> / <ol> levels.
 */
function extractListItems(innerHtml: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let inLi = false;
  let currentLi = '';

  const tagRegex = /<\/?(li|ul|ol)\b[^>]*>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(innerHtml)) !== null) {
    const tag = match[0].toLowerCase();
    const tagIndex = match.index;

    if (inLi) {
      currentLi += innerHtml.slice(lastIndex, tagIndex);
    }

    if (tag.startsWith('<ul') || tag.startsWith('<ol')) {
      depth++;
      if (inLi) currentLi += match[0];
    } else if (tag.startsWith('</ul') || tag.startsWith('</ol')) {
      depth = Math.max(0, depth - 1);
      if (inLi) currentLi += match[0];
    } else if (tag.startsWith('<li')) {
      if (depth === 0) {
        inLi = true;
        currentLi = '';
      } else if (inLi) {
        currentLi += match[0];
      }
    } else if (tag.startsWith('</li')) {
      if (depth === 0 && inLi) {
        if (currentLi.trim()) {
          items.push(currentLi.trim());
        }
        inLi = false;
        currentLi = '';
      } else if (inLi) {
        currentLi += match[0];
      }
    }
    lastIndex = tagRegex.lastIndex;
  }

  if (inLi && currentLi.trim()) {
    items.push(currentLi.trim());
  }

  return items;
}

/**
 * Parse an HTML list (<ul> or <ol>) recursively into ListBlock or OrderedListBlock,
 * properly converting nested <li><ul>...</ul></li> into item.children[].
 */
function parseHtmlList(
  innerHtml: string,
  listType: 'list' | 'ordered_list',
  stats?: BlockStats,
  warnings?: string[],
): ListBlock | OrderedListBlock {
  const rawItems = extractListItems(innerHtml);
  const items: (string | ListItem)[] = [];

  for (const rawItem of rawItems) {
    // Check if this list item contains nested lists
    const nestedStart = /<(ul|ol)\b/i.exec(rawItem);
    if (nestedStart) {
      const childTagName = nestedStart[1].toLowerCase();
      const balanced = extractBalancedTag(
        rawItem,
        nestedStart.index,
        childTagName,
      );

      if (stats) stats.nestedLists++;
      const textBefore = rawItem.slice(0, nestedStart.index);
      const textAfter = rawItem.slice(balanced.endIndex);
      const itemText =
        stripTags(textBefore + ' ' + textAfter) || 'Mục danh sách';

      const childType = childTagName === 'ol' ? 'ordered_list' : 'list';
      if (stats) {
        if (childType === 'ordered_list') stats.orderedLists++;
        else stats.lists++;
      }

      // Remove the outer <ul... > and </ul> from the balanced block
      const childInner = balanced.fullBlock.replace(
        /^<(ul|ol)[^>]*>|<\/(ul|ol)>$/gi,
        '',
      );
      const childBlock = parseHtmlList(childInner, childType, stats, warnings);

      items.push({
        text: itemText,
        children: [childBlock],
      });
    } else {
      const itemText = stripTags(rawItem);
      if (itemText) {
        items.push(itemText);
      }
    }
  }

  // Ensure at least one item exists to satisfy schema
  if (items.length === 0) {
    items.push('Mục danh sách');
  }

  return {
    id: randomUUID(),
    type: listType,
    items,
  };
}

/**
 * Converts legacy raw HTML content to a validated DocumentContent JSON object for Solution entity.
 * Supports:
 * - Headings: <h1> to <h6> -> HeadingBlock (level 1-6)
 * - Paragraphs: <p> -> ParagraphBlock
 * - Lists: <ul>, <ol>, <li> -> ListBlock, OrderedListBlock
 * - Nested lists: <li><ul>...</ul></li> -> ListItem with children[]
 * - Images: <img>, <figure>, <div class="my-8..."> -> ImageBlock (only alt, url, caption, fileId; strictly no title/shortDescription)
 * - Blockquotes: <blockquote> -> QuoteBlock
 * - CTA containers: .project-style-cta -> HeadingBlock + ParagraphBlock + CtaBlock
 * - Unsupported HTML: non-destructively converted to ParagraphBlock with warnings logged.
 * - Plain text fallback: Preserves raw strings without losing a single character.
 */
export function convertSolutionHtmlWithReport(
  html: string | null | undefined,
  _context?: { title?: string; slug?: string },
): ConvertResult {
  void _context;
  const stats: BlockStats = {
    headings: { total: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
    paragraphs: 0,
    lists: 0,
    orderedLists: 0,
    nestedLists: 0,
    images: 0,
    quotes: 0,
    ctas: 0,
    unsupportedTags: [],
  };
  const warnings: string[] = [];

  if (!html || typeof html !== 'string' || html.trim() === '') {
    return {
      document: { version: CURRENT_DOCUMENT_VERSION, blocks: [] },
      stats,
      warnings,
    };
  }

  const blocks: ContentBlock[] = [];
  const normalized = html.trim();

  // Top-level element scanner finding next tag
  const tagFinder =
    /<(div|figure|h[1-6]|blockquote|ul|ol|p|img|table|iframe|video)\b/gi;
  let match: RegExpExecArray | null;
  let cursor = 0;

  while ((match = tagFinder.exec(normalized)) !== null) {
    const tagStartIndex = match.index;
    const tagName = match[1].toLowerCase();

    // Check if there was unhandled plain text before this tag
    if (tagStartIndex > cursor) {
      const leadingText = stripTags(normalized.slice(cursor, tagStartIndex));
      if (leadingText) {
        blocks.push({
          id: randomUUID(),
          type: 'paragraph',
          text: leadingText,
        });
        stats.paragraphs++;
      }
    }

    let raw = '';
    let nextIndex = tagStartIndex;

    // Handle elements
    if (tagName === 'ul' || tagName === 'ol') {
      const balanced = extractBalancedTag(normalized, tagStartIndex, tagName);
      raw = balanced.fullBlock;
      nextIndex = balanced.endIndex;
      tagFinder.lastIndex = nextIndex;
      cursor = nextIndex;

      const inner = raw.replace(/^<(ul|ol)[^>]*>|<\/(ul|ol)>$/gi, '');
      const listType = tagName === 'ol' ? 'ordered_list' : 'list';
      const listBlock = parseHtmlList(inner, listType, stats, warnings);
      if (listType === 'ordered_list') stats.orderedLists++;
      else stats.lists++;
      blocks.push(listBlock);
      continue;
    }

    if (tagName === 'div') {
      const balanced = extractBalancedTag(normalized, tagStartIndex, 'div');
      raw = balanced.fullBlock;
      nextIndex = balanced.endIndex;
      tagFinder.lastIndex = nextIndex;
      cursor = nextIndex;
    } else if (tagName === 'figure') {
      const balanced = extractBalancedTag(normalized, tagStartIndex, 'figure');
      raw = balanced.fullBlock;
      nextIndex = balanced.endIndex;
      tagFinder.lastIndex = nextIndex;
      cursor = nextIndex;
    } else if (tagName === 'blockquote') {
      const balanced = extractBalancedTag(
        normalized,
        tagStartIndex,
        'blockquote',
      );
      raw = balanced.fullBlock;
      nextIndex = balanced.endIndex;
      tagFinder.lastIndex = nextIndex;
      cursor = nextIndex;
    } else if (tagName === 'table') {
      const balanced = extractBalancedTag(normalized, tagStartIndex, 'table');
      raw = balanced.fullBlock;
      nextIndex = balanced.endIndex;
      tagFinder.lastIndex = nextIndex;
      cursor = nextIndex;
    } else if (tagName.startsWith('h')) {
      const hRegex = new RegExp(
        `^<${tagName}[^>]*>[\\s\\S]*?<\\/${tagName}>`,
        'i',
      );
      const hMatch = hRegex.exec(normalized.slice(tagStartIndex));
      if (hMatch) {
        raw = hMatch[0];
        nextIndex = tagStartIndex + raw.length;
        tagFinder.lastIndex = nextIndex;
        cursor = nextIndex;
      }
    } else if (tagName === 'p') {
      const pRegex = /^<p[^>]*>[\s\S]*?<\/p>/i;
      const pMatch = pRegex.exec(normalized.slice(tagStartIndex));
      if (pMatch) {
        raw = pMatch[0];
        nextIndex = tagStartIndex + raw.length;
        tagFinder.lastIndex = nextIndex;
        cursor = nextIndex;
      }
    } else if (tagName === 'img') {
      const imgRegex = /^<img[^>]*\/?>/i;
      const imgMatch = imgRegex.exec(normalized.slice(tagStartIndex));
      if (imgMatch) {
        raw = imgMatch[0];
        nextIndex = tagStartIndex + raw.length;
        tagFinder.lastIndex = nextIndex;
        cursor = nextIndex;
      }
    } else if (tagName === 'iframe' || tagName === 'video') {
      const balanced = extractBalancedTag(normalized, tagStartIndex, tagName);
      raw = balanced.fullBlock;
      nextIndex = balanced.endIndex;
      tagFinder.lastIndex = nextIndex;
      cursor = nextIndex;
    }

    // Case 1: CTA container
    if (/project-style-cta/i.test(raw)) {
      const hMatch = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i.exec(raw);
      if (hMatch) {
        const parsedLevel = parseInt(hMatch[1], 10);
        const level = (
          parsedLevel >= 1 && parsedLevel <= 6 ? parsedLevel : 3
        ) as 1 | 2 | 3 | 4 | 5 | 6;
        const text = stripTags(hMatch[2]);
        if (text) {
          blocks.push({
            id: randomUUID(),
            type: 'heading',
            level,
            text,
          });
          stats.headings.total++;
          (stats.headings as any)[`h${level}`]++;
        }
      }

      const pMatch = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(raw);
      if (pMatch) {
        const text = stripTags(pMatch[1]);
        if (text) {
          blocks.push({
            id: randomUUID(),
            type: 'paragraph',
            text,
          });
          stats.paragraphs++;
        }
      }

      const aMatches = [
        ...raw.matchAll(
          /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
        ),
      ];
      if (aMatches.length > 0) {
        const primaryHref = aMatches[0][1];
        const primaryLabel = stripTags(aMatches[0][2]);
        blocks.push({
          id: randomUUID(),
          type: 'cta',
          label: primaryLabel || 'Liên hệ ngay',
          url: primaryHref,
        });
        stats.ctas++;

        if (aMatches.length > 1) {
          const secHref = aMatches[1][1];
          const secLabel = stripTags(aMatches[1][2]);
          blocks.push({
            id: randomUUID(),
            type: 'cta',
            label: secLabel || 'Xem giải pháp',
            url: secHref,
          });
          stats.ctas++;
        }
      }
      continue;
    }

    // Case 2: Image Card (<div ...><img ...><p>caption</p></div>)
    if (/<img/i.test(raw) && /my-8/i.test(raw)) {
      const srcMatch = /src=["']([^"']+)["']/i.exec(raw);
      const altMatch = /alt=["']([^"']*)["']/i.exec(raw);
      const pCaption = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(raw);

      if (srcMatch && srcMatch[1]) {
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: srcMatch[1],
          fileId: null,
          mediaId: null,
          alt: altMatch
            ? decodeHtmlEntities(altMatch[1]).trim()
            : 'Hình ảnh giải pháp',
          caption: pCaption ? stripTags(pCaption[1]) : null,
        });
        stats.images++;
      }
      continue;
    }

    // Case 3: Figure
    if (/^<figure/i.test(raw)) {
      const srcMatch = /src=["']([^"']+)["']/i.exec(raw);
      const altMatch = /alt=["']([^"']*)["']/i.exec(raw);
      const captionMatch = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i.exec(
        raw,
      );

      if (srcMatch && srcMatch[1]) {
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: srcMatch[1],
          fileId: null,
          mediaId: null,
          alt: altMatch
            ? decodeHtmlEntities(altMatch[1]).trim()
            : 'Hình ảnh giải pháp',
          caption: captionMatch ? stripTags(captionMatch[1]) : null,
        });
        stats.images++;
      }
      continue;
    }

    // Case 4: Headings H1-H6
    const hMatch = /^<h([1-6])/i.exec(raw);
    if (hMatch) {
      const parsedLevel = parseInt(hMatch[1], 10);
      const level = (parsedLevel >= 1 && parsedLevel <= 6 ? parsedLevel : 2) as
        1 | 2 | 3 | 4 | 5 | 6;
      const text = stripTags(raw);
      if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'heading',
          level,
          text,
        });
        stats.headings.total++;
        (stats.headings as any)[`h${level}`]++;
      }
      continue;
    }

    // Case 5: Blockquote
    if (/^<blockquote/i.test(raw)) {
      const text = stripTags(raw);
      if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'quote',
          text,
          author: null,
          citation: null,
        });
        stats.quotes++;
      }
      continue;
    }

    // Case 6: Lists & Nested Lists
    if (/^<ul/i.test(raw)) {
      const innerMatch = /<ul[^>]*>([\s\S]*?)<\/ul>/i.exec(raw);
      const inner = innerMatch ? innerMatch[1] : raw;
      const listBlock = parseHtmlList(inner, 'list', stats, warnings);
      stats.lists++;
      blocks.push(listBlock);
      continue;
    }
    if (/^<ol/i.test(raw)) {
      const innerMatch = /<ol[^>]*>([\s\S]*?)<\/ol>/i.exec(raw);
      const inner = innerMatch ? innerMatch[1] : raw;
      const listBlock = parseHtmlList(inner, 'ordered_list', stats, warnings);
      stats.orderedLists++;
      blocks.push(listBlock);
      continue;
    }

    // Case 7: Standalone Image
    if (/^<img/i.test(raw)) {
      const srcMatch = /src=["']([^"']+)["']/i.exec(raw);
      const altMatch = /alt=["']([^"']*)["']/i.exec(raw);
      if (srcMatch && srcMatch[1]) {
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: srcMatch[1],
          fileId: null,
          mediaId: null,
          alt: altMatch
            ? decodeHtmlEntities(altMatch[1]).trim()
            : 'Hình ảnh giải pháp',
          caption: null,
        });
        stats.images++;
      }
      continue;
    }

    // Case 8: Paragraph
    if (/^<p/i.test(raw)) {
      const imgInside = /<img[^>]*src=["']([^"']+)["'][^>]*>/i.exec(raw);
      const text = stripTags(raw);
      if (imgInside && (!text || text.length === 0)) {
        const altMatch = /alt=["']([^"']*)["']/i.exec(raw);
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: imgInside[1],
          fileId: null,
          mediaId: null,
          alt: altMatch
            ? decodeHtmlEntities(altMatch[1]).trim()
            : 'Hình ảnh giải pháp',
          caption: null,
        });
        stats.images++;
      } else if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'paragraph',
          text,
        });
        stats.paragraphs++;
      }
      continue;
    }

    // Case 9: Unsupported HTML Elements (table, iframe, video, generic div)
    const tagMatch = /^<([a-z0-9]+)/i.exec(raw);
    const unsuppTag = tagMatch ? tagMatch[1].toLowerCase() : tagName;
    const text = stripTags(raw);
    if (!stats.unsupportedTags.includes(unsuppTag)) {
      stats.unsupportedTags.push(unsuppTag);
    }
    warnings.push(
      `Unsupported HTML tag <${unsuppTag}> converted to paragraph to preserve text: "${text.slice(0, 50)}..."`,
    );

    if (text) {
      blocks.push({
        id: randomUUID(),
        type: 'paragraph',
        text,
      });
      stats.paragraphs++;
    }
  }

  // Fallback: If no structured blocks were recognized but raw string exists
  if (blocks.length === 0) {
    const plainText = stripTags(normalized);
    if (plainText) {
      blocks.push({
        id: randomUUID(),
        type: 'paragraph',
        text: plainText,
      });
      stats.paragraphs++;
    }
  }

  return {
    document: {
      version: CURRENT_DOCUMENT_VERSION,
      blocks,
    },
    stats,
    warnings,
  };
}

/**
 * Standard utility wrapper for convertSolutionHtmlToBlocks.
 */
export function convertSolutionHtmlToBlocks(
  html: string | null | undefined,
): DocumentContent {
  const result = convertSolutionHtmlWithReport(html);
  return result.document;
}
