import {
  DocumentContent,
  ContentBlock,
} from '../../../common/types/document-content.types';

/**
 * Recursively rewrites ImageKit URLs inside DocumentContent blocks
 * replacing `/vdcd/projects/${oldKey}/` with `/vdcd/projects/${newSlug}/`.
 */
export function rewriteDocumentContentImageUrls(
  content: DocumentContent | null | undefined,
  oldKey: string,
  newSlug: string,
): boolean {
  if (
    !content ||
    !Array.isArray(content.blocks) ||
    !oldKey ||
    !newSlug ||
    oldKey === newSlug
  ) {
    return false;
  }

  const oldPattern = `/vdcd/projects/${oldKey}/`;
  const newPattern = `/vdcd/projects/${newSlug}/`;
  let changed = false;

  const traverseBlocks = (blocks: ContentBlock[]) => {
    for (const block of blocks) {
      if (!block || typeof block !== 'object') continue;

      // Handle image block
      if (block.type === 'image' && typeof (block as any).url === 'string') {
        const url = (block as any).url as string;
        if (url.includes(oldPattern)) {
          (block as any).url = url.split(oldPattern).join(newPattern);
          changed = true;
        }
      }

      // Handle nested section children
      if (block.type === 'section' && Array.isArray((block as any).children)) {
        traverseBlocks((block as any).children as ContentBlock[]);
      }
    }
  };

  traverseBlocks(content.blocks);
  return changed;
}

/**
 * Rewrites all ImageKit URLs within a Project entity
 * replacing `/vdcd/projects/${oldKey}/` with `/vdcd/projects/${newSlug}/`.
 * Covers: thumbnail, challengeImage, transformationBefore/After, gallery images, and document content.
 */
export function rewriteProjectMediaUrls(
  project: {
    thumbnail?: string | null;
    challengeImage?: string | null;
    transformationBefore?: string | null;
    transformationAfter?: string | null;
    images?: Array<{ id?: string; url: string }> | null;
    content?: any;
  },
  oldKey: string,
  newSlug: string,
): boolean {
  if (!project || !oldKey || !newSlug || oldKey === newSlug) {
    return false;
  }

  const oldPattern = `/vdcd/projects/${oldKey}/`;
  const newPattern = `/vdcd/projects/${newSlug}/`;
  let changed = false;

  const replaceField = (
    field:
      | 'thumbnail'
      | 'challengeImage'
      | 'transformationBefore'
      | 'transformationAfter',
  ) => {
    const val = project[field];
    if (typeof val === 'string' && val.includes(oldPattern)) {
      project[field] = val.split(oldPattern).join(newPattern);
      changed = true;
    }
  };

  replaceField('thumbnail');
  replaceField('challengeImage');
  replaceField('transformationBefore');
  replaceField('transformationAfter');

  // Gallery images
  if (Array.isArray(project.images)) {
    for (const img of project.images) {
      if (img && typeof img.url === 'string' && img.url.includes(oldPattern)) {
        img.url = img.url.split(oldPattern).join(newPattern);
        changed = true;
      }
    }
  }

  // Document Content blocks
  if (project.content && typeof project.content === 'object') {
    const contentChanged = rewriteDocumentContentImageUrls(
      project.content as DocumentContent,
      oldKey,
      newSlug,
    );
    if (contentChanged) {
      changed = true;
    }
  }

  return changed;
}
