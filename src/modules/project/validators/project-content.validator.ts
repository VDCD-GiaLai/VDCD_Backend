// src/modules/project/validators/project-content.validator.ts
import {
  DocumentContent,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';
import {
  validateDocumentContent,
  extractImageFileIds,
} from '../../../common/validators/document-content.validator';

/**
 * Validates project document content according to the unified DocumentContent / BlogDocument standard.
 * Throws BadRequestException if validation fails.
 */
export function validateProjectDocument(input: unknown): DocumentContent {
  if (!input || typeof input !== 'object') {
    return {
      version: CURRENT_DOCUMENT_VERSION,
      blocks: [],
    };
  }

  return validateDocumentContent(input);
}

export { extractImageFileIds };
