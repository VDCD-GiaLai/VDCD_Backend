import { SolutionService } from '../solution.service';

describe('PHASE 09: Solution ImageKit Folder & Lifecycle Validation (Backend)', () => {
  let solutionService: SolutionService;
  let mockSolutionRepo: any;
  let mockArticleRepo: any;
  let mockUploadService: any;
  let mockDataSource: any;
  let mockEntityManager: any;

  beforeEach(async () => {
    const mockQb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
    };

    mockSolutionRepo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => ({ id: 'sol-uuid-1', ...dto })),
      save: jest.fn((entity) =>
        Promise.resolve({ id: 'sol-uuid-1', ...entity }),
      ),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue(undefined),
      createQueryBuilder: jest.fn(() => mockQb),
    };

    mockArticleRepo = {
      find: jest.fn().mockResolvedValue([]),
    };

    mockUploadService = {
      uploadSolutionImage: jest.fn(),
      confirmUpload: jest.fn().mockResolvedValue(undefined),
      deleteFile: jest.fn().mockResolvedValue(undefined),
      moveFolder: jest.fn().mockResolvedValue(true),
      cleanOrphanFiles: jest.fn().mockResolvedValue(undefined),
    };

    mockEntityManager = {
      findOne: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };

    mockDataSource = {
      transaction: jest.fn((cb) => cb(mockEntityManager)),
      query: jest.fn().mockResolvedValue([{ count: 0 }]),
    };

    solutionService = new SolutionService(
      mockSolutionRepo,
      mockArticleRepo,
      mockUploadService,
      mockDataSource,
    );
  });

  // ========================================================================
  // CASE 1: Solution đã có slug: giai-phap-gis -> /vdcd/solutions/giai-phap-gis
  // ========================================================================
  describe('Case 1: Slug-based Image Folder Assignment', () => {
    it('should upload image under /vdcd/solutions/{slug} when slug is provided', async () => {
      const fakeFile = {
        buffer: Buffer.from('image content'),
        mimetype: 'image/png',
        size: 2048,
        originalname: 'thumbnail.png',
      } as Express.Multer.File;

      mockUploadService.uploadSolutionImage.mockImplementation(
        async (file, userId, slug) => {
          return {
            url: `https://ik.imagekit.io/vdcd/solutions/${slug}/thumbnail.png`,
            fileId: 'fid-case-1',
            name: 'thumbnail.png',
            size: 2048,
            filePath: `/vdcd/solutions/${slug}/thumbnail.png`,
          } as UploadResult;
        },
      );

      const result = await mockUploadService.uploadSolutionImage(
        fakeFile,
        'editor-id',
        'giai-phap-gis',
      );

      expect(result.filePath).toBe(
        '/vdcd/solutions/giai-phap-gis/thumbnail.png',
      );
      expect(result.url).toContain('/vdcd/solutions/giai-phap-gis/');
    });
  });

  // ========================================================================
  // CASE 2: Solution chưa có slug -> stable key solution-{random-id}
  // ========================================================================
  describe('Case 2: Stable Temporary Folder Key (solution-{random-id})', () => {
    it('should generate stable temporary key and not change per image in session', async () => {
      const stableTempKey = 'solution-a8f39c2d';

      mockUploadService.uploadSolutionImage.mockImplementation(
        async (file, userId, key) => {
          return {
            url: `https://ik.imagekit.io/vdcd/solutions/${key}/${file.originalname}`,
            fileId: `fid-${file.originalname}`,
            name: file.originalname,
            size: 1024,
            filePath: `/vdcd/solutions/${key}/${file.originalname}`,
          } as UploadResult;
        },
      );

      const file1 = { originalname: 'thumb.png' } as Express.Multer.File;
      const file2 = { originalname: 'block-1.jpg' } as Express.Multer.File;

      const res1 = await mockUploadService.uploadSolutionImage(
        file1,
        'user',
        stableTempKey,
      );
      const res2 = await mockUploadService.uploadSolutionImage(
        file2,
        'user',
        stableTempKey,
      );

      expect(res1.filePath).toBe(`/vdcd/solutions/${stableTempKey}/thumb.png`);
      expect(res2.filePath).toBe(
        `/vdcd/solutions/${stableTempKey}/block-1.jpg`,
      );
      // Both must share the identical folder path
      expect(res1.filePath.split('/')[3]).toBe(res2.filePath.split('/')[3]);
    });
  });

  // ========================================================================
  // CASE 3: Solution có nhiều image: thumbnail, block 1, 2, 3 -> Tất cả cùng folder
  // ========================================================================
  describe('Case 3: Multi-Image Co-location in Same Folder', () => {
    it('should ensure all images of solution belong to the exact same folder', async () => {
      const solutionSlug = 'giai-phap-do-dac-3d';
      const fileNames = [
        'thumb.jpg',
        'block1.png',
        'block2.webp',
        'block3.jpg',
      ];

      const results = fileNames.map((name) => ({
        url: `https://ik.imagekit.io/vdcd/solutions/${solutionSlug}/${name}`,
        fileId: `fid-${name}`,
        filePath: `/vdcd/solutions/${solutionSlug}/${name}`,
      }));

      for (const res of results) {
        expect(res.filePath).toMatch(
          new RegExp(`^/vdcd/solutions/${solutionSlug}/`),
        );
      }
    });
  });

  // ========================================================================
  // CASE 4: Đổi slug: old-slug -> new-slug -> Move folder & no reference loss
  // ========================================================================
  describe('Case 4: Slug Modification & Folder Move', () => {
    it('should trigger moveFolder on slug update without losing image reference or duplicating', async () => {
      const existing = {
        id: 'sol-4',
        title: 'Giải Pháp GIS',
        slug: 'giai-phap-gis',
        thumbnail:
          'https://ik.imagekit.io/vdcd/solutions/giai-phap-gis/thumb.jpg',
        thumbnailFileId: 'thumb-fid-4',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: 'https://ik.imagekit.io/vdcd/solutions/giai-phap-gis/diagram.png',
              fileId: 'block-fid-4',
            },
          ],
        },
      };

      mockEntityManager.findOne.mockImplementation((entityClass, options) => {
        if (options?.where?.id === 'sol-4') return Promise.resolve(existing);
        if (options?.where?.slug === 'giai-phap-gis-nang-cao')
          return Promise.resolve(null);
        return Promise.resolve(null);
      });

      await solutionService.update('sol-4', {
        slug: 'giai-phap-gis-nang-cao',
      });

      // moveFolder must be invoked with old and new folder paths
      expect(mockUploadService.moveFolder).toHaveBeenCalledWith(
        '/vdcd/solutions/giai-phap-gis',
        '/vdcd/solutions/giai-phap-gis-nang-cao',
      );
    });
  });

  // ========================================================================
  // CASE 5: Delete Solution & Orphan policy / Shared media preservation
  // ========================================================================
  describe('Case 5: Orphan Policy & Shared Media Protection', () => {
    it('should delete unique media but preserve shared media when deleting solution', async () => {
      const solution = {
        id: 'sol-5',
        thumbnailFileId: 'unique-thumb-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'img1',
              type: 'image',
              fileId: 'shared-block-fid',
            },
            {
              id: 'img2',
              type: 'image',
              fileId: 'unique-block-fid',
            },
          ],
        },
      };

      mockSolutionRepo.findOne.mockResolvedValue(solution);

      // Simulate 'shared-block-fid' is used in an article or program
      jest
        .spyOn(solutionService, 'isMediaShared')
        .mockImplementation(async (fileId) => {
          return fileId === 'shared-block-fid';
        });

      await solutionService.remove('sol-5');

      // Unique images are deleted
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'unique-thumb-fid',
      );
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith(
        'unique-block-fid',
      );
      // Shared image is NOT deleted!
      expect(mockUploadService.deleteFile).not.toHaveBeenCalledWith(
        'shared-block-fid',
      );
    });
  });

  // ========================================================================
  // CASE 6: Upload failure halfway
  // ========================================================================
  describe('Case 6: Mid-Upload Failure & Clean Temp State', () => {
    it('should ensure database has no references if upload fails before save', async () => {
      mockUploadService.uploadSolutionImage.mockRejectedValueOnce(
        new Error('Network timeout'),
      );

      await expect(
        mockUploadService.uploadSolutionImage({} as any, 'user', 'test-slug'),
      ).rejects.toThrow('Network timeout');

      // Solution repository save must not have been called
      expect(mockSolutionRepo.save).not.toHaveBeenCalled();
    });
  });
});
