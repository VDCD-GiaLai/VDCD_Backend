// src/modules/program/utils/html-to-blocks.util.ts
import { randomUUID } from 'crypto';
import {
  DocumentContent,
  ContentBlock,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, '')).trim();
}

/**
 * Converts legacy raw HTML content to a validated DocumentContent JSON object for Program entity.
 * Specifically handles:
 * - Complex CTA containers: <div class="project-style-cta ..."> -> CtaBlock
 * - Custom Image cards: <div class="my-8 rounded-2xl ..."><img ...><p>caption</p></div> -> ImageBlock with caption
 * - Standard figures: <figure><img ...><figcaption>...</figcaption></figure>
 * - Headings: <h1> - <h6> -> HeadingBlock
 * - Paragraphs: <p> -> ParagraphBlock
 * - Lists: <ul>, <ol>, <li> -> ListBlock, OrderedListBlock
 * - Blockquotes: <blockquote> -> QuoteBlock
 * - Standalone images: <img ...> -> ImageBlock
 */
export function convertProgramHtmlToBlocks(
  html: string | null | undefined,
): DocumentContent {
  if (!html || typeof html !== 'string' || html.trim() === '') {
    return { version: CURRENT_DOCUMENT_VERSION, blocks: [] };
  }

  const blocks: ContentBlock[] = [];
  const normalized = html.trim();

  // Pattern matching top-level elements:
  // 1. CTA container: <div class="project-style-cta[\s\S]*?<\/div>\s*<\/div>
  // 2. Image card div: <div class="[^"]*my-8[^"]*"[\s\S]*?<\/div>
  // 3. figure: <figure[\s\S]*?<\/figure>
  // 4. h1-h6: <h[1-6][^>]*>[\s\S]*?<\/h[1-6]>
  // 5. blockquote: <blockquote[^>]*>[\s\S]*?<\/blockquote>
  // 6. ul: <ul[^>]*>[\s\S]*?<\/ul>
  // 7. ol: <ol[^>]*>[\s\S]*?<\/ol>
  // 8. p: <p[^>]*>[\s\S]*?<\/p>
  // 9. img: <img[^>]*\/?>
  const elementRegex =
    /(<div\s+class=["'][^"']*project-style-cta[^"']*["'][\s\S]*?<\/div>\s*<\/div>|<div\s+class=["'][^"']*my-8[^"']*["'][\s\S]*?<\/div>|<figure[\s\S]*?<\/figure>|<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<blockquote[^>]*>[\s\S]*?<\/blockquote>|<ul[^>]*>[\s\S]*?<\/ul>|<ol[^>]*>[\s\S]*?<\/ol>|<p[^>]*>[\s\S]*?<\/p>|<img[^>]*\/?>)/gi;

  let match: RegExpExecArray | null;
  while ((match = elementRegex.exec(normalized)) !== null) {
    const raw = match[0];

    // Case 1: CTA container
    if (/project-style-cta/i.test(raw)) {
      // 1. Preserve any heading inside CTA container
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
        }
      }

      // 2. Preserve any paragraph inside CTA container
      const pMatch = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(raw);
      if (pMatch) {
        const text = stripTags(pMatch[1]);
        if (text) {
          blocks.push({
            id: randomUUID(),
            type: 'paragraph',
            text,
          });
        }
      }

      // 3. Extract CTA action buttons
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

        if (aMatches.length > 1) {
          const secHref = aMatches[1][1];
          const secLabel = stripTags(aMatches[1][2]);
          blocks.push({
            id: randomUUID(),
            type: 'cta',
            label: secLabel || 'Xem giải pháp',
            url: secHref,
          });
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
            : 'Hình ảnh chương trình',
          caption: pCaption ? stripTags(pCaption[1]) : null,
        });
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
            : 'Hình ảnh chương trình',
          caption: captionMatch ? stripTags(captionMatch[1]) : null,
        });
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
      }
      continue;
    }

    // Case 6: Lists
    if (/^<ul/i.test(raw)) {
      const liMatches = [...raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      const items = liMatches.map((m) => stripTags(m[1])).filter(Boolean);
      if (items.length > 0) {
        blocks.push({
          id: randomUUID(),
          type: 'list',
          items,
        });
      }
      continue;
    }
    if (/^<ol/i.test(raw)) {
      const liMatches = [...raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      const items = liMatches.map((m) => stripTags(m[1])).filter(Boolean);
      if (items.length > 0) {
        blocks.push({
          id: randomUUID(),
          type: 'ordered_list',
          items,
        });
      }
      continue;
    }

    // Case 7: Image Standalone
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
            : 'Hình ảnh chương trình',
          caption: null,
        });
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
            : 'Hình ảnh chương trình',
          caption: null,
        });
      } else if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'paragraph',
          text,
        });
      }
      continue;
    }
  }

  // Fallback: If no structured blocks were recognized but plain text exists
  if (blocks.length === 0) {
    const plainText = stripTags(normalized);
    if (plainText) {
      blocks.push({
        id: randomUUID(),
        type: 'paragraph',
        text: plainText,
      });
    }
  }

  return {
    version: CURRENT_DOCUMENT_VERSION,
    blocks,
  };
}
