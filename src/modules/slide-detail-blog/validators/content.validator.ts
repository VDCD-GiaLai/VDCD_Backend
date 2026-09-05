// src/modules/slide-detail-blog/validators/content.validator.ts

/**
 * Re-exporting from shared Document Content validator.
 * SlideDetailBlog and Article use the exact same validation logic.
 */

export * from '../../../common/validators/document-content.validator';

import {
  validateDocumentContent,
  DocumentValidationOptions,
} from '../../../common/validators/document-content.validator';
import { DocumentContent } from '../../../common/types/document-content.types';

export function validateBlogContent(
  content: unknown,
  options?: DocumentValidationOptions,
): DocumentContent {
  return validateDocumentContent(content, {
    allowedHeadingLevels: options?.allowedHeadingLevels ?? [2, 3],
  });
}
