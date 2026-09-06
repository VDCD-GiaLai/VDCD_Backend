// src/common/validators/document-content.validator.ts
import { BadRequestException } from '@nestjs/common';
import {
  DocumentContent,
  ContentBlock,
  SectionChildBlock,
  BLOCK_TYPES,
  SECTION_CHILD_BLOCK_TYPES,
  CURRENT_DOCUMENT_VERSION,
  BlockType,
  ListItem,
} from '../types/document-content.types';

// ── Security Check ────────────────────────────────────────────────
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<script/i,
  /<\/script>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data:text\/html/i,
  /\bon[a-z]+\s*=/i, // e.g. onload=, onerror=, onclick=
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /<applet/i,
  /<base/i,
];

export function assertSafeText(value: unknown, path: string): void {
  if (typeof value !== 'string') return;
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(value)) {
      throw new BadRequestException(
        `${path}: Chứa nội dung không an toàn hoặc mã thực thi nguy hiểm`,
      );
    }
  }
}

export interface DocumentValidationOptions {
  allowedHeadingLevels?: number[]; // Defaults to [1, 2, 3, 4, 5, 6]
}

/**
 * Validate the entire DocumentContent object.
 * Throws BadRequestException with descriptive error messages.
 */
export function validateDocumentContent(
  content: unknown,
  options?: DocumentValidationOptions,
): DocumentContent {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new BadRequestException('Content phải là object');
  }

  const obj = content as Record<string, unknown>;

  // Version
  if (obj.version === undefined || obj.version === null) {
    throw new BadRequestException('Content phải có field "version"');
  }
  if (typeof obj.version !== 'number' || obj.version < 1) {
    throw new BadRequestException('Content version phải là số nguyên >= 1');
  }
  if (obj.version > CURRENT_DOCUMENT_VERSION) {
    throw new BadRequestException(
      `Content version ${obj.version} không được hỗ trợ. Version hiện tại: ${CURRENT_DOCUMENT_VERSION}`,
    );
  }

  // Blocks
  if (!Array.isArray(obj.blocks)) {
    throw new BadRequestException('Content phải có field "blocks" là array');
  }

  // heroMeta (optional)
  if (obj.heroMeta !== undefined && obj.heroMeta !== null) {
    validateHeroMeta(obj.heroMeta, 'heroMeta');
  }

  const seenIds = new Set<string>();

  for (let i = 0; i < obj.blocks.length; i++) {
    validateBlock(obj.blocks[i], `blocks[${i}]`, seenIds, false, options);
  }

  return content as DocumentContent;
}

/**
 * Validate a single block.
 * @param isChild true when validating inside SectionBlock.children
 */
function validateBlock(
  block: unknown,
  path: string,
  seenIds: Set<string>,
  isChild: boolean,
  options?: DocumentValidationOptions,
): void {
  if (!block || typeof block !== 'object' || Array.isArray(block)) {
    throw new BadRequestException(`${path}: Block phải là object`);
  }

  const b = block as Record<string, unknown>;

  // Common: id
  if (typeof b.id !== 'string' || b.id.trim() === '') {
    throw new BadRequestException(`${path}: Block phải có "id" là string`);
  }
  if (seenIds.has(b.id)) {
    throw new BadRequestException(`${path}: Block id "${b.id}" bị trùng lặp`);
  }
  seenIds.add(b.id);
  assertSafeText(b.id, `${path}.id`);

  // Common: type
  if (typeof b.type !== 'string') {
    throw new BadRequestException(`${path}: Block phải có "type" là string`);
  }

  // Common: spacing (optional)
  if (b.spacing !== undefined && b.spacing !== null) {
    validateBlockSpacing(b.spacing, `${path}.spacing`);
  }

  const allowedTypes = isChild ? SECTION_CHILD_BLOCK_TYPES : BLOCK_TYPES;
  if (!allowedTypes.includes(b.type as any)) {
    throw new BadRequestException(
      `${path}: Block type "${b.type}" không hợp lệ. Cho phép: ${allowedTypes.join(', ')}`,
    );
  }

  // Dispatch by type
  switch (b.type as BlockType) {
    case 'heading':
      validateHeading(b, path, options);
      break;
    case 'paragraph':
      validateParagraph(b, path);
      break;
    case 'image':
      validateImage(b, path);
      break;
    case 'list':
    case 'ordered_list':
      validateList(b, path, seenIds, options);
      break;
    case 'quote':
      validateQuote(b, path);
      break;
    case 'highlight':
      validateHighlight(b, path);
      break;
    case 'section':
      validateSection(b, path, seenIds, options);
      break;
    case 'cta':
      validateCta(b, path);
      break;
  }
}

// ── 1. Heading Validation (H1-H6) ────────────────────────────────
function validateHeading(
  b: Record<string, unknown>,
  path: string,
  options?: DocumentValidationOptions,
): void {
  const allowed = options?.allowedHeadingLevels ?? [1, 2, 3, 4, 5, 6];
  if (
    typeof b.level !== 'number' ||
    !Number.isInteger(b.level) ||
    !allowed.includes(b.level)
  ) {
    if (allowed.length === 2 && allowed.includes(2) && allowed.includes(3)) {
      throw new BadRequestException(
        `${path}: HeadingBlock.level phải là 2 hoặc 3`,
      );
    }
    throw new BadRequestException(
      `${path}: HeadingBlock.level phải là số nguyên từ 1 đến 6 (H1-H6)`,
    );
  }
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    throw new BadRequestException(
      `${path}: HeadingBlock.text không được để trống`,
    );
  }
  assertSafeText(b.text, `${path}.text`);

  // Optional fontSize check
  if (b.fontSize !== undefined && b.fontSize !== null) {
    if (typeof b.fontSize !== 'string') {
      throw new BadRequestException(
        `${path}: HeadingBlock.fontSize phải là string`,
      );
    }
    assertSafeText(b.fontSize, `${path}.fontSize`);
  }
}

// ── 2. Paragraph Validation ──────────────────────────────────────
function validateParagraph(b: Record<string, unknown>, path: string): void {
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    throw new BadRequestException(
      `${path}: ParagraphBlock.text không được để trống`,
    );
  }
  assertSafeText(b.text, `${path}.text`);
}

// ── 3. Image Validation ──────────────────────────────────────────
function validateImage(b: Record<string, unknown>, path: string): void {
  // STRICT: Do not allow title, subtitle, excerpt in ImageBlock
  if (b.title !== undefined) {
    throw new BadRequestException(
      `${path}: ImageBlock không được chứa thuộc tính "title"`,
    );
  }
  if (b.subtitle !== undefined) {
    throw new BadRequestException(
      `${path}: ImageBlock không được chứa thuộc tính "subtitle"`,
    );
  }
  if (b.excerpt !== undefined) {
    throw new BadRequestException(
      `${path}: ImageBlock không được chứa thuộc tính "excerpt"`,
    );
  }

  if (typeof b.url !== 'string' || b.url.trim() === '') {
    throw new BadRequestException(
      `${path}: ImageBlock.url không được để trống`,
    );
  }
  assertSafeText(b.url, `${path}.url`);

  const effectiveFileId = b.fileId !== undefined ? b.fileId : b.mediaId;
  if (
    effectiveFileId !== undefined &&
    effectiveFileId !== null &&
    typeof effectiveFileId !== 'string'
  ) {
    throw new BadRequestException(
      `${path}: ImageBlock.fileId phải là string hoặc null`,
    );
  }
  if (typeof effectiveFileId === 'string') {
    assertSafeText(effectiveFileId, `${path}.fileId`);
  }

  if (typeof b.alt !== 'string') {
    throw new BadRequestException(`${path}: ImageBlock.alt phải là string`);
  }
  assertSafeText(b.alt, `${path}.alt`);

  if (
    b.caption !== undefined &&
    b.caption !== null &&
    typeof b.caption !== 'string'
  ) {
    throw new BadRequestException(
      `${path}: ImageBlock.caption phải là string hoặc null`,
    );
  }
  if (typeof b.caption === 'string') {
    assertSafeText(b.caption, `${path}.caption`);
  }
}

// ── 4. List & Ordered List Validation (Recursive) ────────────────
function validateList(
  b: Record<string, unknown>,
  path: string,
  seenIds: Set<string>,
  options?: DocumentValidationOptions,
): void {
  if (!Array.isArray(b.items) || b.items.length === 0) {
    throw new BadRequestException(
      `${path}: ListBlock.items phải là array không rỗng`,
    );
  }

  for (let i = 0; i < b.items.length; i++) {
    const item = b.items[i];
    if (typeof item === 'string') {
      if (item.trim() === '') {
        throw new BadRequestException(
          `${path}.items[${i}]: Item phải là string không rỗng`,
        );
      }
      assertSafeText(item, `${path}.items[${i}]`);
    } else if (item && typeof item === 'object' && !Array.isArray(item)) {
      const listItem = item as ListItem;
      if (typeof listItem.text !== 'string' || listItem.text.trim() === '') {
        throw new BadRequestException(
          `${path}.items[${i}].text: Item text không được để trống`,
        );
      }
      assertSafeText(listItem.text, `${path}.items[${i}].text`);
      if (listItem.children !== undefined && listItem.children !== null) {
        if (!Array.isArray(listItem.children)) {
          throw new BadRequestException(
            `${path}.items[${i}].children phải là array`,
          );
        }
        for (let j = 0; j < listItem.children.length; j++) {
          validateBlock(
            listItem.children[j],
            `${path}.items[${i}].children[${j}]`,
            seenIds,
            true,
            options,
          );
        }
      }
    } else {
      throw new BadRequestException(
        `${path}.items[${i}]: Item phải là string hoặc ListItem object`,
      );
    }
  }

  // Recursive children property on the list block itself
  if (b.children !== undefined && b.children !== null) {
    if (!Array.isArray(b.children)) {
      throw new BadRequestException(`${path}.children phải là array`);
    }
    for (let i = 0; i < b.children.length; i++) {
      validateBlock(
        b.children[i],
        `${path}.children[${i}]`,
        seenIds,
        true,
        options,
      );
    }
  }
}

// ── 5. Quote Validation ──────────────────────────────────────────
function validateQuote(b: Record<string, unknown>, path: string): void {
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    throw new BadRequestException(
      `${path}: QuoteBlock.text không được để trống`,
    );
  }
  assertSafeText(b.text, `${path}.text`);

  if (b.author !== undefined && b.author !== null) {
    if (typeof b.author !== 'string') {
      throw new BadRequestException(
        `${path}: QuoteBlock.author phải là string`,
      );
    }
    assertSafeText(b.author, `${path}.author`);
  }

  if (b.citation !== undefined && b.citation !== null) {
    if (typeof b.citation !== 'string') {
      throw new BadRequestException(
        `${path}: QuoteBlock.citation phải là string`,
      );
    }
    assertSafeText(b.citation, `${path}.citation`);
  }
}

// ── 6. Highlight Validation ──────────────────────────────────────
function validateHighlight(b: Record<string, unknown>, path: string): void {
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    throw new BadRequestException(
      `${path}: HighlightBlock.text không được để trống`,
    );
  }
  assertSafeText(b.text, `${path}.text`);

  if (b.style !== undefined && b.style !== null) {
    if (typeof b.style !== 'string') {
      throw new BadRequestException(
        `${path}: HighlightBlock.style phải là string`,
      );
    }
    assertSafeText(b.style, `${path}.style`);
  }
}

// ── 7. Section Validation ────────────────────────────────────────
function validateSection(
  b: Record<string, unknown>,
  path: string,
  seenIds: Set<string>,
  options?: DocumentValidationOptions,
): void {
  if (typeof b.number !== 'string' || b.number.trim() === '') {
    throw new BadRequestException(
      `${path}: SectionBlock.number không được để trống`,
    );
  }
  assertSafeText(b.number, `${path}.number`);

  if (typeof b.title !== 'string' || b.title.trim() === '') {
    throw new BadRequestException(
      `${path}: SectionBlock.title không được để trống`,
    );
  }
  assertSafeText(b.title, `${path}.title`);

  if (!Array.isArray(b.children)) {
    throw new BadRequestException(
      `${path}: SectionBlock.children phải là array`,
    );
  }
  for (let i = 0; i < b.children.length; i++) {
    validateBlock(
      b.children[i],
      `${path}.children[${i}]`,
      seenIds,
      true,
      options,
    );
  }
}

// ── 8. CTA Validation ────────────────────────────────────────────
function validateCta(b: Record<string, unknown>, path: string): void {
  if (typeof b.label !== 'string' || b.label.trim() === '') {
    throw new BadRequestException(
      `${path}: CtaBlock.label không được để trống`,
    );
  }
  assertSafeText(b.label, `${path}.label`);

  if (typeof b.url !== 'string' || b.url.trim() === '') {
    throw new BadRequestException(`${path}: CtaBlock.url không được để trống`);
  }
  assertSafeText(b.url, `${path}.url`);
}

// ── Extract All Image File IDs ───────────────────────────────────
export function extractImageFileIds(content: DocumentContent): string[] {
  const fileIds: string[] = [];

  function scanBlock(block: ContentBlock | SectionChildBlock) {
    if (block.type === 'image') {
      const fid = block.fileId ?? block.mediaId;
      if (fid) {
        fileIds.push(fid);
      }
    } else if (block.type === 'section') {
      for (const child of block.children) {
        scanBlock(child);
      }
    } else if (block.type === 'list' || block.type === 'ordered_list') {
      if (block.children) {
        for (const child of block.children) {
          scanBlock(child);
        }
      }
      for (const item of block.items) {
        if (typeof item === 'object' && item.children) {
          for (const child of item.children) {
            scanBlock(child);
          }
        }
      }
    }
  }

  if (content && Array.isArray(content.blocks)) {
    for (const b of content.blocks) {
      scanBlock(b);
    }
  }

  return fileIds;
}

// ── 9. Block Spacing Validation ──────────────────────────────────
function validateBlockSpacing(spacing: unknown, path: string): void {
  if (!spacing || typeof spacing !== 'object' || Array.isArray(spacing)) {
    throw new BadRequestException(`${path}: spacing phải là object`);
  }
  const s = spacing as Record<string, unknown>;
  if (s.marginTop !== undefined && s.marginTop !== null) {
    if (typeof s.marginTop !== 'number' || s.marginTop < 0) {
      throw new BadRequestException(`${path}.marginTop phải là số không âm`);
    }
  }
  if (s.marginBottom !== undefined && s.marginBottom !== null) {
    if (typeof s.marginBottom !== 'number' || s.marginBottom < 0) {
      throw new BadRequestException(`${path}.marginBottom phải là số không âm`);
    }
  }
}

// ── 10. Hero Meta Validation ─────────────────────────────────────
function validateHeroMeta(heroMeta: unknown, path: string): void {
  if (!heroMeta || typeof heroMeta !== 'object' || Array.isArray(heroMeta)) {
    throw new BadRequestException(`${path}: heroMeta phải là object`);
  }
  const h = heroMeta as Record<string, unknown>;
  if (h.placement !== undefined && h.placement !== null) {
    if (
      !['above_title', 'between_title_desc', 'below_desc'].includes(
        h.placement as string,
      )
    ) {
      throw new BadRequestException(`${path}.placement không hợp lệ`);
    }
  }
  if (h.position !== undefined && h.position !== null) {
    if (!['top', 'center', 'bottom'].includes(h.position as string)) {
      throw new BadRequestException(`${path}.position không hợp lệ`);
    }
  }
  if (h.caption !== undefined && h.caption !== null) {
    if (typeof h.caption !== 'string') {
      throw new BadRequestException(`${path}.caption phải là string`);
    }
    assertSafeText(h.caption, `${path}.caption`);
  }
}
