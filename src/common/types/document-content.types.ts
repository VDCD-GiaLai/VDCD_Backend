// src/common/types/document-content.types.ts

/**
 * Shared Generic Block-based Document Content Architecture.
 * Unified across Article and SlideDetailBlog.
 */

// ── 0. Base Block & Spacing ──────────────────────────────────────
export interface BlockSpacing {
  marginTop?: number;
  marginBottom?: number;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  spacing?: BlockSpacing;
}

// ── 1. Heading Block ─────────────────────────────────────────────
export interface HeadingBlock {
  id: string;
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6; // H1-H6 supported
  text: string;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; // Separated styling attribute
  spacing?: BlockSpacing;
}

// ── 2. Paragraph Block ───────────────────────────────────────────
export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
  spacing?: BlockSpacing;
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
  spacing?: BlockSpacing;
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
  spacing?: BlockSpacing;
}

export interface OrderedListBlock {
  id: string;
  type: 'ordered_list';
  items: (string | ListItem)[];
  children?: (ListBlock | OrderedListBlock)[]; // Recursive multi-level support
  spacing?: BlockSpacing;
}

// ── 5. Quote Block ───────────────────────────────────────────────
export interface QuoteBlock {
  id: string;
  type: 'quote';
  text: string;
  author?: string | null;
  citation?: string | null;
  spacing?: BlockSpacing;
}

// ── 6. Highlight Block ───────────────────────────────────────────
export interface HighlightBlock {
  id: string;
  type: 'highlight';
  text: string;
  style?: string;
  spacing?: BlockSpacing;
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
  spacing?: BlockSpacing;
}

// ── 8. Call To Action (CTA) Block ────────────────────────────────
export interface CtaBlock {
  id: string;
  type: 'cta';
  label: string;
  url: string;
  spacing?: BlockSpacing;
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

/** Generic unified alias for ContentBlock */
export type Block = ContentBlock;

// ── Hero Metadata ────────────────────────────────────────────────
export type HeroPlacement = 'above_title' | 'between_title_desc' | 'below_desc';

export interface HeroMeta {
  placement?: HeroPlacement;
  position?: 'top' | 'center' | 'bottom';
  caption?: string;
}

// ── Document Root ────────────────────────────────────────────────
export const CURRENT_DOCUMENT_VERSION = 1;

export type DocumentContent = {
  version: number;
  blocks: ContentBlock[];
  heroMeta?: HeroMeta;
};

/** Generic unified aliases for DocumentContent */
export type ContentDocument = DocumentContent;
export type BlogDocument = DocumentContent;
export type Document = DocumentContent;

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
