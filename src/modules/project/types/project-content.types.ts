// src/modules/project/types/project-content.types.ts

/**
 * Re-exporting from shared Document Content architecture.
 * Project uses the exact same canonical document model as SlideDetailBlog, Solution, Program, and Article.
 * Strictly adheres to Single Document Model (NO ProjectDocument or ProjectBlock).
 */

export * from '../../../common/types/document-content.types';

import {
  DocumentContent,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';

export const CURRENT_CONTENT_VERSION = CURRENT_DOCUMENT_VERSION;
export type ProjectContent = DocumentContent;
