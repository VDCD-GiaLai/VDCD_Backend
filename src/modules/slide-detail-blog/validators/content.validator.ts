// src/modules/slide-detail-blog/validators/content.validator.ts
import { BadRequestException } from '@nestjs/common';
import {
  BlogContent,
  ContentBlock,
  SectionChildBlock,
  BLOCK_TYPES,
  SECTION_CHILD_BLOCK_TYPES,
  CURRENT_CONTENT_VERSION,
  BlockType,
} from '../types/blog-content.types';

/**
 * Validate the entire BlogContent object.
 * Throws BadRequestException with descriptive messages.
 */
export function validateBlogContent(content: unknown): BlogContent {
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
  if (obj.version > CURRENT_CONTENT_VERSION) {
    throw new BadRequestException(
      `Content version ${obj.version} không được hỗ trợ. Version hiện tại: ${CURRENT_CONTENT_VERSION}`,
    );
  }

  // Blocks
  if (!Array.isArray(obj.blocks)) {
    throw new BadRequestException('Content phải có field "blocks" là array');
  }

  const seenIds = new Set<string>();

  for (let i = 0; i < obj.blocks.length; i++) {
    validateBlock(obj.blocks[i], `blocks[${i}]`, seenIds, false);
  }

  return content as BlogContent;
}

/**
 * Validate a single block.
 * @param isChild  true when validating inside SectionBlock.children
 */
function validateBlock(
  block: unknown,
  path: string,
  seenIds: Set<string>,
  isChild: boolean,
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

  // Common: type
  if (typeof b.type !== 'string') {
    throw new BadRequestException(`${path}: Block phải có "type" là string`);
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
      validateHeading(b, path);
      break;
    case 'paragraph':
      validateParagraph(b, path);
      break;
    case 'image':
      validateImage(b, path);
      break;
    case 'list':
      validateList(b, path);
      break;
    case 'section':
      validateSection(b, path, seenIds);
      break;
    case 'cta':
      validateCta(b, path);
      break;
  }
}

function validateHeading(b: Record<string, unknown>, path: string): void {
  if (typeof b.level !== 'number' || (b.level !== 2 && b.level !== 3)) {
    throw new BadRequestException(
      `${path}: HeadingBlock.level phải là 2 hoặc 3`,
    );
  }
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    throw new BadRequestException(
      `${path}: HeadingBlock.text không được để trống`,
    );
  }
}

function validateParagraph(b: Record<string, unknown>, path: string): void {
  if (typeof b.text !== 'string' || b.text.trim() === '') {
    throw new BadRequestException(
      `${path}: ParagraphBlock.text không được để trống`,
    );
  }
}

function validateImage(b: Record<string, unknown>, path: string): void {
  if (typeof b.url !== 'string' || b.url.trim() === '') {
    throw new BadRequestException(
      `${path}: ImageBlock.url không được để trống`,
    );
  }
  if (b.fileId !== null && typeof b.fileId !== 'string') {
    throw new BadRequestException(
      `${path}: ImageBlock.fileId phải là string hoặc null`,
    );
  }
  if (typeof b.alt !== 'string') {
    throw new BadRequestException(`${path}: ImageBlock.alt phải là string`);
  }
  if (b.caption !== null && typeof b.caption !== 'string') {
    throw new BadRequestException(
      `${path}: ImageBlock.caption phải là string hoặc null`,
    );
  }
}

function validateList(b: Record<string, unknown>, path: string): void {
  if (!Array.isArray(b.items) || b.items.length === 0) {
    throw new BadRequestException(
      `${path}: ListBlock.items phải là array không rỗng`,
    );
  }
  for (let i = 0; i < b.items.length; i++) {
    if (typeof b.items[i] !== 'string' || b.items[i].trim() === '') {
      throw new BadRequestException(
        `${path}.items[${i}]: Item phải là string không rỗng`,
      );
    }
  }
}

function validateSection(
  b: Record<string, unknown>,
  path: string,
  seenIds: Set<string>,
): void {
  if (typeof b.number !== 'string' || b.number.trim() === '') {
    throw new BadRequestException(
      `${path}: SectionBlock.number không được để trống`,
    );
  }
  if (typeof b.title !== 'string' || b.title.trim() === '') {
    throw new BadRequestException(
      `${path}: SectionBlock.title không được để trống`,
    );
  }
  if (!Array.isArray(b.children)) {
    throw new BadRequestException(
      `${path}: SectionBlock.children phải là array`,
    );
  }
  for (let i = 0; i < b.children.length; i++) {
    validateBlock(b.children[i], `${path}.children[${i}]`, seenIds, true);
  }
}

function validateCta(b: Record<string, unknown>, path: string): void {
  if (typeof b.label !== 'string' || b.label.trim() === '') {
    throw new BadRequestException(
      `${path}: CtaBlock.label không được để trống`,
    );
  }
  if (typeof b.url !== 'string' || b.url.trim() === '') {
    throw new BadRequestException(`${path}: CtaBlock.url không được để trống`);
  }
}

/**
 * Extract all ImageBlock.fileId values from content (hero image not included).
 * Used for image cleanup on update/delete.
 */
export function extractImageFileIds(content: BlogContent): string[] {
  const fileIds: string[] = [];

  function scanBlocks(blocks: readonly (ContentBlock | SectionChildBlock)[]) {
    for (const block of blocks) {
      if (block.type === 'image' && block.fileId) {
        fileIds.push(block.fileId);
      }
      if (block.type === 'section') {
        scanBlocks(block.children);
      }
    }
  }

  scanBlocks(content.blocks);
  return fileIds;
}
