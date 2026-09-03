// src/modules/slide-detail-blog/types/blog-content.types.ts

/**
 * Blog Content — Block-based structured content for SlideDetailBlog.
 * Version 1 schema with 6 block types.
 */

// ── Block Definitions ────────────────────────────────────────────

export interface HeadingBlock {
  id: string;
  type: 'heading';
  level: 2 | 3;
  text: string;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  fileId: string | null;
  alt: string;
  caption: string | null;
}

export interface ListBlock {
  id: string;
  type: 'list';
  items: string[];
}

/** Children inside a SectionBlock — no nesting of sections or cta */
export type SectionChildBlock =
  HeadingBlock | ParagraphBlock | ImageBlock | ListBlock;

export interface SectionBlock {
  id: string;
  type: 'section';
  number: string;
  title: string;
  children: SectionChildBlock[];
}

export interface CtaBlock {
  id: string;
  type: 'cta';
  label: string;
  url: string;
}

// ── Union ────────────────────────────────────────────────────────

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | SectionBlock
  | CtaBlock;

// ── Root ─────────────────────────────────────────────────────────

export const CURRENT_CONTENT_VERSION = 1;

export interface BlogContent {
  version: number;
  blocks: ContentBlock[];
}

// ── Block type enum (for validation) ─────────────────────────────

export const BLOCK_TYPES = [
  'heading',
  'paragraph',
  'image',
  'list',
  'section',
  'cta',
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

/** Block types allowed inside SectionBlock.children */
export const SECTION_CHILD_BLOCK_TYPES = [
  'heading',
  'paragraph',
  'image',
  'list',
] as const;
