// src/modules/article/utils/html-to-blocks.util.ts
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
 * Converts legacy raw HTML content to a validated DocumentContent JSON object.
 * Preserves paragraphs, headings (h1-h6), figures with captions, images, lists, and quotes.
 */
export function convertHtmlToBlocks(
  html: string | null | undefined,
): DocumentContent {
  if (!html || typeof html !== 'string' || html.trim() === '') {
    return { version: CURRENT_DOCUMENT_VERSION, blocks: [] };
  }

  const blocks: ContentBlock[] = [];
  const normalized = html.trim();

  // Pattern matching top-level block elements
  const blockRegex =
    /(<figure[\s\S]*?<\/figure>|<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<blockquote[^>]*>[\s\S]*?<\/blockquote>|<ul[^>]*>[\s\S]*?<\/ul>|<ol[^>]*>[\s\S]*?<\/ol>|<p[^>]*>[\s\S]*?<\/p>|<img[^>]*\/?>)/gi;

  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(normalized)) !== null) {
    const rawElement = match[0];
    const tagMatch = /^<([a-z0-9]+)/i.exec(rawElement);
    if (!tagMatch) continue;
    const tagName = tagMatch[1].toLowerCase();

    if (tagName === 'figure') {
      const srcMatch = /src=["']([^"']+)["']/i.exec(rawElement);
      const altMatch = /alt=["']([^"']*)["']/i.exec(rawElement);
      const captionMatch = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i.exec(
        rawElement,
      );

      if (srcMatch && srcMatch[1]) {
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: srcMatch[1],
          fileId: null,
          alt: altMatch ? decodeHtmlEntities(altMatch[1]).trim() : '',
          caption: captionMatch ? stripTags(captionMatch[1]) : null,
        });
      }
    } else if (tagName === 'img') {
      const srcMatch = /src=["']([^"']+)["']/i.exec(rawElement);
      const altMatch = /alt=["']([^"']*)["']/i.exec(rawElement);

      if (srcMatch && srcMatch[1]) {
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: srcMatch[1],
          fileId: null,
          alt: altMatch ? decodeHtmlEntities(altMatch[1]).trim() : '',
          caption: null,
        });
      }
    } else if (tagName.startsWith('h')) {
      const parsedLevel = parseInt(tagName.replace('h', ''), 10);
      const level = (parsedLevel >= 1 && parsedLevel <= 6 ? parsedLevel : 2) as
        1 | 2 | 3 | 4 | 5 | 6;
      const text = stripTags(rawElement);
      if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'heading',
          level,
          text,
        });
      }
    } else if (tagName === 'blockquote') {
      const text = stripTags(rawElement);
      if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'quote',
          text,
          author: null,
          citation: null,
        });
      }
    } else if (tagName === 'ul') {
      const itemMatches = rawElement.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      const items: string[] = [];
      for (const im of itemMatches) {
        const itemText = stripTags(im[1]);
        if (itemText) items.push(itemText);
      }
      if (items.length > 0) {
        blocks.push({
          id: randomUUID(),
          type: 'list',
          items,
        });
      }
    } else if (tagName === 'ol') {
      const itemMatches = rawElement.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      const items: string[] = [];
      for (const im of itemMatches) {
        const itemText = stripTags(im[1]);
        if (itemText) items.push(itemText);
      }
      if (items.length > 0) {
        blocks.push({
          id: randomUUID(),
          type: 'ordered_list',
          items,
        });
      }
    } else if (tagName === 'p') {
      // Check if p tag only contains an img
      const imgInP = /<img[^>]*src=["']([^"']+)["'][^>]*>/i.exec(rawElement);
      const text = stripTags(rawElement);
      if (imgInP && (!text || text.length === 0)) {
        const altMatch = /alt=["']([^"']*)["']/i.exec(rawElement);
        blocks.push({
          id: randomUUID(),
          type: 'image',
          url: imgInP[1],
          fileId: null,
          alt: altMatch ? decodeHtmlEntities(altMatch[1]).trim() : '',
          caption: null,
        });
      } else if (text) {
        blocks.push({
          id: randomUUID(),
          type: 'paragraph',
          text,
        });
      }
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
