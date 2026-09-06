// src/modules/project/tests/project-database-migration.spec.ts
import {
  convertProjectToBlocks,
  convertDocumentToProjectLegacy,
  RawProjectData,
} from '../utils/project-to-blocks.util';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';

describe('Project Content Migration Utility (Phase 04)', () => {
  const sampleProject: RawProjectData = {
    id: '426ba0c6-31c8-4cc0-b120-a35e369ba6a7',
    title: 'Lotte Mall Võ Chí Công',
    overview:
      'Giám sát, quản lý công trình xây dựng Lotte Mall Võ Chí Công ứng dụng công nghệ cao. Theo dõi tiến độ thi công toàn diện.',
    challenge:
      'Lotte Mall Võ Chí Công là tổ hợp thương mại – dịch vụ – căn hộ quy mô lớn tại Tây Hồ, Hà Nội. Dự án yêu cầu giám sát liên tục 24/7 trên nhiều góc quay khác nhau.',
    challenge_image:
      'https://vdcd.vn/wp-content/uploads/2024/03/Lotte-Mall-1.jpg',
    challenge_image_file_id: 'fid-challenge-lotte',
    services: ['Khảo sát 2D', 'Giám sát tiến độ', 'Mô hình BIM 3D'],
    transformation_before:
      'https://vdcd.vn/wp-content/uploads/2024/03/lotte-before.jpg',
    transformation_before_file_id: 'fid-before-lotte',
    transformation_after:
      'https://vdcd.vn/wp-content/uploads/2024/03/lotte-after.jpg',
    transformation_after_file_id: 'fid-after-lotte',
    technical_highlights: [
      { label: 'Diện tích', value: '120 ha' },
      { label: 'Công nghệ', value: 'AutoTimelapse 4K' },
    ],
  };

  it('should convert raw project fields into a valid DocumentContent with 4 structured sections', () => {
    const doc = convertProjectToBlocks(sampleProject);

    expect(doc.version).toBe(1);
    expect(doc.blocks).toHaveLength(4);

    // Section 1: Tổng quan
    const sec1 = doc.blocks[0];
    expect(sec1.type).toBe('section');
    if (sec1.type === 'section') {
      expect(sec1.number).toBe('01');
      expect(sec1.title).toBe('Tổng quan');
      expect(sec1.children[0].type).toBe('paragraph');
      expect(sec1.children[1].type).toBe('heading');
      expect(sec1.children[2].type).toBe('list');
    }

    // Section 2: Thách thức
    const sec2 = doc.blocks[1];
    expect(sec2.type).toBe('section');
    if (sec2.type === 'section') {
      expect(sec2.number).toBe('02');
      expect(sec2.title).toBe('Thách thức');
      expect(sec2.children[0].type).toBe('paragraph');
      expect(sec2.children[1].type).toBe('image');
      if (sec2.children[1].type === 'image') {
        expect(sec2.children[1].fileId).toBe('fid-challenge-lotte');
      }
    }

    // Section 3: Chuyển đổi
    const sec3 = doc.blocks[2];
    expect(sec3.type).toBe('section');
    if (sec3.type === 'section') {
      expect(sec3.number).toBe('03');
      expect(sec3.title).toBe('Chuyển đổi');
      expect(sec3.children).toHaveLength(2);
      expect(sec3.children[0].type).toBe('image');
      expect(sec3.children[1].type).toBe('image');
    }

    // Section 4: Điểm nổi bật kỹ thuật
    const sec4 = doc.blocks[3];
    expect(sec4.type).toBe('section');
    if (sec4.type === 'section') {
      expect(sec4.number).toBe('04');
      expect(sec4.title).toBe('Điểm nổi bật kỹ thuật');
      expect(sec4.children[0].type).toBe('list');
    }

    // STRICT: Must pass canonical validateDocumentContent without throwing
    const validated = validateDocumentContent(doc);
    expect(validated).toBeDefined();
  });

  it('should handle project with empty/null optional fields gracefully', () => {
    const minimalProject: RawProjectData = {
      id: 'min-1',
      title: 'Minimal Project',
      overview: 'Chỉ có mô tả tổng quan ngắn.',
    };

    const doc = convertProjectToBlocks(minimalProject);
    expect(doc.version).toBe(1);
    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0].type).toBe('section');

    const validated = validateDocumentContent(doc);
    expect(validated).toBeDefined();
  });

  it('should reverse-map DocumentContent back to legacy fields for rollback', () => {
    const doc = convertProjectToBlocks(sampleProject);
    const restored = convertDocumentToProjectLegacy(doc);

    expect(restored.overview).toBe(sampleProject.overview);
    expect(restored.challenge).toBe(sampleProject.challenge);
    expect(restored.challengeImage).toBe(sampleProject.challenge_image);
    expect(restored.challengeImageFileId).toBe(
      sampleProject.challenge_image_file_id,
    );
    expect(restored.services).toEqual(sampleProject.services);
    expect(restored.transformationBefore).toBe(
      sampleProject.transformation_before,
    );
    expect(restored.transformationAfter).toBe(
      sampleProject.transformation_after,
    );
    expect(restored.technicalHighlights).toEqual([
      { label: 'Diện tích', value: '120 ha' },
      { label: 'Công nghệ', value: 'AutoTimelapse 4K' },
    ]);
  });
});
