// src/modules/project/utils/project-to-blocks.util.ts
import {
  DocumentContent,
  ContentBlock,
  SectionChildBlock,
  CURRENT_DOCUMENT_VERSION,
} from '../../../common/types/document-content.types';

export interface RawProjectData {
  id: string;
  title: string;
  overview?: string | null;
  challenge?: string | null;
  challengeImage?: string | null;
  challenge_image?: string | null;
  challengeImageFileId?: string | null;
  challenge_image_file_id?: string | null;
  services?: string[] | string | null;
  transformationBefore?: string | null;
  transformation_before?: string | null;
  transformationBeforeFileId?: string | null;
  transformation_before_file_id?: string | null;
  transformationAfter?: string | null;
  transformation_after?: string | null;
  transformationAfterFileId?: string | null;
  transformation_after_file_id?: string | null;
  technicalHighlights?: { label: string; value: string }[] | string | null;
  technical_highlights?: { label: string; value: string }[] | string | null;
}

/**
 * Parses raw services data into an array of string items.
 */
function parseServices(servicesInput: unknown): string[] {
  if (!servicesInput) return [];
  if (Array.isArray(servicesInput)) {
    return servicesInput
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0);
  }
  if (typeof servicesInput === 'string') {
    const trimmed = servicesInput.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((s) => String(s).trim())
            .filter((s) => s.length > 0);
        }
      } catch {
        // fallthrough
      }
    }
    return trimmed
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
}

/**
 * Parses raw technical highlights data into an array of { label, value }.
 */
function parseTechnicalHighlights(
  highlightsInput: unknown,
): { label: string; value: string }[] {
  if (!highlightsInput) return [];
  if (Array.isArray(highlightsInput)) {
    return highlightsInput
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        label: String(item.label || '').trim(),
        value: String(item.value || '').trim(),
      }))
      .filter((item) => item.label.length > 0 && item.value.length > 0);
  }
  if (typeof highlightsInput === 'string') {
    const trimmed = highlightsInput.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parseTechnicalHighlights(parsed);
      }
    } catch {
      // fallthrough
    }
  }
  return [];
}

/**
 * Converts legacy Project fields into a standardized BlogDocument (DocumentContent).
 *
 * MAPPING STRATEGY:
 * - Section 01: "Tổng quan"
 *     - Paragraph: overview
 *     - If services: Heading H3 ("Dịch vụ cung cấp") + ListBlock
 * - Section 02: "Thách thức dự án"
 *     - Paragraph: challenge
 *     - If challenge_image: ImageBlock
 * - Section 03: "Chuyển đổi số & Hiện trạng" (if transformation images exist)
 *     - ImageBlock: transformation_before
 *     - ImageBlock: transformation_after
 * - Section 04: "Điểm nổi bật kỹ thuật" (if technical_highlights exist)
 *     - ListBlock: items formatted as "label: value"
 */
export function convertProjectToBlocks(data: RawProjectData): DocumentContent {
  const shortId = (data.id || 'proj').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  const blocks: ContentBlock[] = [];
  let sectionIndex = 1;

  // ── 1. Section: Tổng quan ──────────────────────────────────────
  const overviewText = (data.overview || '').trim();
  const servicesList = parseServices(data.services);

  if (overviewText || servicesList.length > 0) {
    const sectionChildren: SectionChildBlock[] = [];

    if (overviewText) {
      sectionChildren.push({
        id: `blk-ovw-p-${shortId}`,
        type: 'paragraph',
        text: overviewText,
      });
    }

    if (servicesList.length > 0) {
      sectionChildren.push({
        id: `blk-srv-h-${shortId}`,
        type: 'heading',
        level: 3,
        text: 'Dịch vụ cung cấp',
      });
      sectionChildren.push({
        id: `blk-srv-lst-${shortId}`,
        type: 'list',
        items: servicesList.map((srv) => ({
          text: srv,
        })),
      });
    }

    if (sectionChildren.length > 0) {
      blocks.push({
        id: `blk-sec-overview-${shortId}`,
        type: 'section',
        number: String(sectionIndex++).padStart(2, '0'),
        title: 'Tổng quan',
        children: sectionChildren,
      });
    }
  }

  // ── 2. Section: Thách thức dự án ──────────────────────────────
  const challengeText = (data.challenge || '').trim();
  const challengeImg = (
    data.challengeImage ||
    data.challenge_image ||
    ''
  ).trim();
  const challengeImgFid = (
    data.challengeImageFileId ||
    data.challenge_image_file_id ||
    ''
  ).trim();

  if (challengeText || challengeImg) {
    const sectionChildren: SectionChildBlock[] = [];

    if (challengeText) {
      sectionChildren.push({
        id: `blk-chg-p-${shortId}`,
        type: 'paragraph',
        text: challengeText,
      });
    }

    if (challengeImg) {
      sectionChildren.push({
        id: `blk-chg-img-${shortId}`,
        type: 'image',
        url: challengeImg,
        fileId: challengeImgFid || null,
        alt: `Thách thức dự án ${data.title || ''}`.trim(),
        caption: 'Hiện trạng khảo sát công trình',
      });
    }

    if (sectionChildren.length > 0) {
      blocks.push({
        id: `blk-sec-challenge-${shortId}`,
        type: 'section',
        number: String(sectionIndex++).padStart(2, '0'),
        title: 'Thách thức',
        children: sectionChildren,
      });
    }
  }

  // ── 3. Section: Chuyển đổi số & Hiện trạng ─────────────────────
  const transBefore = (
    data.transformationBefore ||
    data.transformation_before ||
    ''
  ).trim();
  const transBeforeFid = (
    data.transformationBeforeFileId ||
    data.transformation_before_file_id ||
    ''
  ).trim();
  const transAfter = (
    data.transformationAfter ||
    data.transformation_after ||
    ''
  ).trim();
  const transAfterFid = (
    data.transformationAfterFileId ||
    data.transformation_after_file_id ||
    ''
  ).trim();

  if (transBefore || transAfter) {
    const sectionChildren: SectionChildBlock[] = [];

    if (transBefore) {
      sectionChildren.push({
        id: `blk-trans-before-${shortId}`,
        type: 'image',
        url: transBefore,
        fileId: transBeforeFid || null,
        alt: `Hiện trạng trước chuyển đổi - ${data.title || ''}`.trim(),
        caption: 'Hiện trạng trước chuyển đổi số',
      });
    }

    if (transAfter) {
      sectionChildren.push({
        id: `blk-trans-after-${shortId}`,
        type: 'image',
        url: transAfter,
        fileId: transAfterFid || null,
        alt: `Kết quả sau chuyển đổi số - ${data.title || ''}`.trim(),
        caption: 'Kết quả sau chuyển đổi số',
      });
    }

    if (sectionChildren.length > 0) {
      blocks.push({
        id: `blk-sec-transformation-${shortId}`,
        type: 'section',
        number: String(sectionIndex++).padStart(2, '0'),
        title: 'Chuyển đổi',
        children: sectionChildren,
      });
    }
  }

  // ── 4. Section: Điểm nổi bật kỹ thuật ─────────────────────────
  const highlights = parseTechnicalHighlights(
    data.technicalHighlights || data.technical_highlights,
  );

  if (highlights.length > 0) {
    const sectionChildren: SectionChildBlock[] = [
      {
        id: `blk-hl-lst-${shortId}`,
        type: 'list',
        items: highlights.map((h) => ({
          text: `${h.label}: ${h.value}`,
        })),
      },
    ];

    blocks.push({
      id: `blk-sec-highlights-${shortId}`,
      type: 'section',
      number: String(sectionIndex++).padStart(2, '0'),
      title: 'Điểm nổi bật kỹ thuật',
      children: sectionChildren,
    });
  }

  return {
    version: CURRENT_DOCUMENT_VERSION,
    blocks,
  };
}

/**
 * Reverse mapping utility to restore legacy fields from DocumentContent if rollback is needed.
 */
export function convertDocumentToProjectLegacy(doc: DocumentContent): {
  overview: string | null;
  challenge: string | null;
  challengeImage: string | null;
  challengeImageFileId: string | null;
  services: string[];
  transformationBefore: string | null;
  transformationBeforeFileId: string | null;
  transformationAfter: string | null;
  transformationAfterFileId: string | null;
  technicalHighlights: { label: string; value: string }[];
} {
  let overview: string | null = null;
  let challenge: string | null = null;
  let challengeImage: string | null = null;
  let challengeImageFileId: string | null = null;
  const services: string[] = [];
  let transformationBefore: string | null = null;
  let transformationBeforeFileId: string | null = null;
  let transformationAfter: string | null = null;
  let transformationAfterFileId: string | null = null;
  const technicalHighlights: { label: string; value: string }[] = [];

  if (!doc || !Array.isArray(doc.blocks)) {
    return {
      overview,
      challenge,
      challengeImage,
      challengeImageFileId,
      services,
      transformationBefore,
      transformationBeforeFileId,
      transformationAfter,
      transformationAfterFileId,
      technicalHighlights,
    };
  }

  for (const block of doc.blocks) {
    if (block.type === 'section') {
      const titleLower = (block.title || '').toLowerCase();

      if (titleLower.includes('tổng quan')) {
        for (const child of block.children) {
          if (child.type === 'paragraph' && !overview) {
            overview = child.text;
          } else if (child.type === 'list') {
            for (const item of child.items) {
              const text = typeof item === 'string' ? item : item.text;
              if (text) services.push(text);
            }
          }
        }
      } else if (titleLower.includes('thách thức')) {
        for (const child of block.children) {
          if (child.type === 'paragraph' && !challenge) {
            challenge = child.text;
          } else if (child.type === 'image' && !challengeImage) {
            challengeImage = child.url;
            challengeImageFileId = child.fileId ?? child.mediaId ?? null;
          }
        }
      } else if (titleLower.includes('chuyển đổi')) {
        const images = block.children.filter((c) => c.type === 'image');
        if (images.length > 0 && images[0].type === 'image') {
          transformationBefore = images[0].url;
          transformationBeforeFileId =
            images[0].fileId ?? images[0].mediaId ?? null;
        }
        if (images.length > 1 && images[1].type === 'image') {
          transformationAfter = images[1].url;
          transformationAfterFileId =
            images[1].fileId ?? images[1].mediaId ?? null;
        }
      } else if (
        titleLower.includes('nổi bật') ||
        titleLower.includes('kỹ thuật')
      ) {
        for (const child of block.children) {
          if (child.type === 'list') {
            for (const item of child.items) {
              const text = typeof item === 'string' ? item : item.text;
              if (text && text.includes(':')) {
                const [label, ...valParts] = text.split(':');
                technicalHighlights.push({
                  label: label.trim(),
                  value: valParts.join(':').trim(),
                });
              }
            }
          }
        }
      }
    }
  }

  return {
    overview,
    challenge,
    challengeImage,
    challengeImageFileId,
    services,
    transformationBefore,
    transformationBeforeFileId,
    transformationAfter,
    transformationAfterFileId,
    technicalHighlights,
  };
}
