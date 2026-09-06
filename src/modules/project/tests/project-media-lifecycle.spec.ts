import {
  rewriteDocumentContentImageUrls,
  rewriteProjectMediaUrls,
} from '../utils/project-media.util';
import { DocumentContent } from '../../../common/types/document-content.types';

describe('Project Media Lifecycle & ImageKit Architecture', () => {
  describe('rewriteDocumentContentImageUrls', () => {
    it('should rewrite ImageKit URLs in top-level image blocks', () => {
      const content: DocumentContent = {
        version: 1,
        blocks: [
          {
            id: 'b1',
            type: 'image',
            url: 'https://ik.imagekit.io/vdcd/vdcd/projects/temp-session-123/drone.webp',
            fileId: 'fid-1',
          },
        ],
      };

      const changed = rewriteDocumentContentImageUrls(
        content,
        'temp-session-123',
        'smart-city-gia-lai',
      );

      expect(changed).toBe(true);
      expect((content.blocks[0] as any).url).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/smart-city-gia-lai/drone.webp',
      );
    });

    it('should recursively rewrite ImageKit URLs inside nested section blocks', () => {
      const content: DocumentContent = {
        version: 1,
        blocks: [
          {
            id: 'sec-1',
            type: 'section',
            number: '01',
            title: 'Khảo sát hiện trường',
            children: [
              {
                id: 'img-sec-1',
                type: 'image',
                url: 'https://ik.imagekit.io/vdcd/vdcd/projects/project-a8f31c/field.webp',
                fileId: 'fid-sec-1',
              },
            ],
          },
        ],
      };

      const changed = rewriteDocumentContentImageUrls(
        content,
        'project-a8f31c',
        'do-thi-thong-minh',
      );

      expect(changed).toBe(true);
      const section = content.blocks[0] as any;
      expect(section.children[0].url).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/do-thi-thong-minh/field.webp',
      );
    });

    it('should return false if no matching URLs exist', () => {
      const content: DocumentContent = {
        version: 1,
        blocks: [
          {
            id: 'b1',
            type: 'paragraph',
            text: 'Không có ảnh ở đây',
          },
        ],
      };

      const changed = rewriteDocumentContentImageUrls(
        content,
        'temp-session-123',
        'smart-city-gia-lai',
      );

      expect(changed).toBe(false);
    });
  });

  describe('rewriteProjectMediaUrls', () => {
    it('should rewrite thumbnail, challenge, transformation, gallery and content', () => {
      const project: any = {
        thumbnail:
          'https://ik.imagekit.io/vdcd/vdcd/projects/temp-abc/thumb.webp',
        challengeImage:
          'https://ik.imagekit.io/vdcd/vdcd/projects/temp-abc/challenge.webp',
        transformationBefore:
          'https://ik.imagekit.io/vdcd/vdcd/projects/temp-abc/before.webp',
        transformationAfter:
          'https://ik.imagekit.io/vdcd/vdcd/projects/temp-abc/after.webp',
        images: [
          {
            id: 'gal-1',
            url: 'https://ik.imagekit.io/vdcd/vdcd/projects/temp-abc/gallery1.webp',
          },
        ],
        content: {
          version: 1,
          blocks: [
            {
              id: 'blk-img',
              type: 'image',
              url: 'https://ik.imagekit.io/vdcd/vdcd/projects/temp-abc/content.webp',
            },
          ],
        },
      };

      const changed = rewriteProjectMediaUrls(
        project,
        'temp-abc',
        'du-an-nong-nghiep-so',
      );

      expect(changed).toBe(true);
      expect(project.thumbnail).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/du-an-nong-nghiep-so/thumb.webp',
      );
      expect(project.challengeImage).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/du-an-nong-nghiep-so/challenge.webp',
      );
      expect(project.transformationBefore).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/du-an-nong-nghiep-so/before.webp',
      );
      expect(project.transformationAfter).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/du-an-nong-nghiep-so/after.webp',
      );
      expect(project.images[0].url).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/du-an-nong-nghiep-so/gallery1.webp',
      );
      expect(project.content.blocks[0].url).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/du-an-nong-nghiep-so/content.webp',
      );
    });

    it('should return false if oldKey equals newSlug', () => {
      const project: any = {
        thumbnail:
          'https://ik.imagekit.io/vdcd/vdcd/projects/same-slug/thumb.webp',
      };
      const changed = rewriteProjectMediaUrls(
        project,
        'same-slug',
        'same-slug',
      );
      expect(changed).toBe(false);
      expect(project.thumbnail).toBe(
        'https://ik.imagekit.io/vdcd/vdcd/projects/same-slug/thumb.webp',
      );
    });
  });
});
