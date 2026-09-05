// src/modules/slide-detail-blog/types/blog-content.types.ts

/**
 * Re-exporting from shared Document Content architecture.
 * SlideDetailBlog and Article use the exact same content model.
 */

export * from '../../../common/types/document-content.types';

import {
  DocumentContent,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';

export const CURRENT_CONTENT_VERSION = CURRENT_DOCUMENT_VERSION;
export type BlogContent = DocumentContent;
