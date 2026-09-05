// src/common/types/document-content.types.ts

/**
 * Shared Generic Block-based Document Content Architecture.
 * Unified across Article and SlideDetailBlog.
 */

// ── 1. Heading Block ─────────────────────────────────────────────
export interface HeadingBlock {
  id: string;
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6; // H1-H6 supported
  text: string;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; // Separated styling attribute
}

// ── 2. Paragraph Block ───────────────────────────────────────────
export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
}

// ── 3. Image Block ───────────────────────────────────────────────
export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  fileId?: string | null;
  mediaId?: string | null; // Supported as alias for fileId
  alt: string;
  caption?: string | null;
  // NOTE: title, subtitle, excerpt are strictly NOT allowed in ImageBlock
}

// ── 4. List & Ordered List Blocks (Recursive) ────────────────────
export interface ListItem {
  text: string;
  children?: (ListBlock | OrderedListBlock)[];
}

export interface ListBlock {
  id: string;
  type: 'list';
  items: (string | ListItem)[];
  children?: (ListBlock | OrderedListBlock)[]; // Recursive multi-level support
}

export interface OrderedListBlock {
  id: string;
  type: 'ordered_list';
  items: (string | ListItem)[];
  children?: (ListBlock | OrderedListBlock)[]; // Recursive multi-level support
}

// ── 5. Quote Block ───────────────────────────────────────────────
export interface QuoteBlock {
  id: string;
  type: 'quote';
  text: string;
  author?: string | null;
  citation?: string | null;
}

// ── 6. Highlight Block ───────────────────────────────────────────
export interface HighlightBlock {
  id: string;
  type: 'highlight';
  text: string;
  style?: string;
}

// ── 7. Section Block ─────────────────────────────────────────────
export type SectionChildBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | OrderedListBlock
  | QuoteBlock
  | HighlightBlock;

export interface SectionBlock {
  id: string;
  type: 'section';
  number?: string;
  title: string;
  children: SectionChildBlock[];
}

// ── 8. Call To Action (CTA) Block ────────────────────────────────
export interface CtaBlock {
  id: string;
  type: 'cta';
  label: string;
  url: string;
}

// ── Union of all Blocks ──────────────────────────────────────────
export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | OrderedListBlock
  | QuoteBlock
  | HighlightBlock
  | SectionBlock
  | CtaBlock;

// ── Document Root ────────────────────────────────────────────────
export const CURRENT_DOCUMENT_VERSION = 1;

export interface DocumentContent {
  version: number;
  blocks: ContentBlock[];
}

// ── Block Types constants ────────────────────────────────────────
export const BLOCK_TYPES = [
  'heading',
  'paragraph',
  'image',
  'list',
  'ordered_list',
  'quote',
  'highlight',
  'section',
  'cta',
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const SECTION_CHILD_BLOCK_TYPES = [
  'heading',
  'paragraph',
  'image',
  'list',
  'ordered_list',
  'quote',
  'highlight',
] as const;
