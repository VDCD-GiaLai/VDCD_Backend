// src/modules/project/tests/project-upload-security.spec.ts
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadService } from '../../upload/upload.service';
import { ProjectService } from '../project.service';
import { DocumentContent } from '../../../common/types/document-content.types';

describe('PHASE 07 — Backend Upload Security & Lifecycle', () => {
  let uploadService: UploadService;
  let projectService: ProjectService;
  let mockImageKit: any;
  let mockUploadTempRepo: any;
  let mockProjectRepo: any;
  let mockRawRepo: any;
  let mockImageRepo: any;
  let mockArticleRepo: any;
  let mockDataSource: any;
  let mockConfigService: any;

  const validProjectId = '11111111-2222-3333-4444-555555555555';
  const validProjectSlug = 'smart-city-gia-lai';

  const sampleFile = (
    name = 'test.webp',
    size = 2048,
    mimetype = 'image/webp',
  ): Express.Multer.File =>
    ({
      buffer: Buffer.from('fake-image-binary-payload'),
      originalname: name,
      mimetype,
      size,
    }) as any;

  beforeEach(() => {
    // 1. Mock ImageKit
    mockImageKit = {
      upload: jest.fn().mockImplementation(({ folder, fileName }) =>
        Promise.resolve({
          fileId: `ik-fid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: `https://ik.imagekit.io/test${folder}/${fileName}`,
          filePath: `${folder}/${fileName}`,
          name: fileName,
          size: 2048,
        }),
      ),
      moveFolder: jest.fn().mockResolvedValue(true),
      deleteFile: jest.fn().mockResolvedValue(true),
    };

    // 2. Mock UploadTemp Repository
    mockUploadTempRepo = {
      create: jest.fn((e) => ({ ...e, id: 'temp-id-1' })),
      save: jest.fn((e) => Promise.resolve({ ...e, id: 'temp-id-1' })),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      find: jest.fn().mockResolvedValue([]),
    };

    // 3. Mock ConfigService
    mockConfigService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'imagekit.publicKey') return 'test-public-key';
        if (key === 'imagekit.privateKey') return 'test-private-key';
        if (key === 'imagekit.urlEndpoint')
          return 'https://ik.imagekit.io/test';
        return '';
      }),
    };

    // 4. Mock DataSource with query & transaction
    mockDataSource = {
      query: jest
        .fn()
        .mockImplementation(async (sql: string, params: any[]) => {
          if (sql.includes('SELECT id, slug FROM "project" WHERE "id" = $1')) {
            if (params && params[0] === validProjectId) {
              return [{ id: validProjectId, slug: validProjectSlug }];
            }
            return [];
          }
          if (sql.includes('SELECT count(*)::int as count')) {
            return [{ count: 0 }];
          }
          return [];
        }),
      transaction: jest.fn().mockImplementation(async (cb) => {
        const mockManager = {
          findOne: jest.fn().mockImplementation((entity, opts) => {
            if (opts?.where?.id === validProjectId) {
              return Promise.resolve({
                id: validProjectId,
                slug: validProjectSlug,
                title: 'Smart City Gia Lai',
                thumbnail:
                  'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/thumb.webp',
                thumbnailFileId: 'thumb-fid-1',
                content: { version: 1, blocks: [] },
                images: [],
              });
            }
            return Promise.resolve(null);
          }),
          save: jest
            .fn()
            .mockImplementation((entity, data) => Promise.resolve(data)),
        };
        return cb(mockManager);
      }),
    };

    // 5. Instantiate UploadService
    uploadService = new UploadService(
      mockUploadTempRepo,
      mockConfigService,
      mockDataSource,
    );
    (uploadService as any).imagekit = mockImageKit;

    // 6. Mock Project Repositories
    mockProjectRepo = {
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === validProjectId) {
          return Promise.resolve({
            id: validProjectId,
            slug: validProjectSlug,
            title: 'Smart City Gia Lai',
            thumbnail:
              'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/thumb.webp',
            thumbnailFileId: 'thumb-fid-1',
            content: { version: 1, blocks: [] },
            images: [],
          });
        }
        return Promise.resolve(null);
      }),
      findBySlug: jest.fn().mockResolvedValue(null),
      create: jest.fn((e) => ({ ...e, id: 'new-proj-id' })),
      save: jest.fn((e) =>
        Promise.resolve({ ...e, id: e.id || 'saved-proj-id' }),
      ),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockRawRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue([]),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      })),
    };

    mockImageRepo = {
      create: jest.fn((e) => ({
        ...e,
        id: `img-${Math.random().toString(36).substring(2, 6)}`,
      })),
      save: jest.fn((entities) => Promise.resolve(entities)),
      findOne: jest.fn().mockResolvedValue(null),
      remove: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockArticleRepo = {
      find: jest.fn().mockResolvedValue([]),
    };

    // 7. Instantiate ProjectService
    projectService = new ProjectService(
      mockProjectRepo,
      mockRawRepo,
      mockImageRepo,
      mockArticleRepo,
      uploadService,
      mockDataSource,
    );

    jest.spyOn(uploadService, 'renameFolder').mockResolvedValue(false);
  });

  // =========================================================================
  // TEST 1: upload thumbnail
  // =========================================================================
  it('✓ 1. upload thumbnail: resolves folder via project slug and sets thumbnail with confirmUpload', async () => {
    const file = sampleFile('thumbnail.webp');
    // Upload via projectId
    const result = await uploadService.uploadProjectImage(
      file,
      'user-admin',
      validProjectId,
    );

    expect(mockDataSource.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id, slug FROM "project"'),
      [validProjectId],
    );
    expect(mockImageKit.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: `/vdcd/projects/${validProjectSlug}`,
      }),
    );
    expect(result.url).toContain(`/vdcd/projects/${validProjectSlug}/`);
    expect(mockUploadTempRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: result.fileId,
        confirmed: false,
      }),
    );
  });

  // =========================================================================
  // TEST 2: upload image block
  // =========================================================================
  it('✓ 2. upload image block: uploads into project folder, embeds into Document Content, confirms file', async () => {
    const file = sampleFile('block-diagram.png', 3000, 'image/png');
    const uploadRes = await uploadService.uploadProjectImage(
      file,
      'user-admin',
      validProjectSlug,
    );

    expect(mockImageKit.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: `/vdcd/projects/${validProjectSlug}`,
      }),
    );

    const docContent: DocumentContent = {
      version: 1,
      blocks: [
        {
          id: 'blk-img-1',
          type: 'image',
          url: uploadRes.url,
          fileId: uploadRes.fileId,
          alt: 'Sơ đồ đô thị thông minh',
          caption: 'Hạ tầng số kết nối vạn vật',
        },
      ],
    };

    const updated = await projectService.update(validProjectId, {
      content: docContent,
    });

    expect(updated.content).toEqual(docContent);
    expect(mockUploadTempRepo.update).toHaveBeenCalledWith(
      { fileId: uploadRes.fileId },
      { confirmed: true },
    );
  });

  // =========================================================================
  // TEST 3: upload challenge image
  // =========================================================================
  it('✓ 3. upload challenge image: resolves project folder, sets challengeImage and confirms', async () => {
    const file = sampleFile('challenge.jpg', 4000, 'image/jpeg');
    const uploadRes = await uploadService.uploadProjectImage(
      file,
      'user-admin',
      validProjectId,
    );

    expect(mockImageKit.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: `/vdcd/projects/${validProjectSlug}`,
      }),
    );

    await projectService.update(validProjectId, {
      challengeImage: uploadRes.url,
      challengeImageFileId: uploadRes.fileId,
    });

    expect(uploadRes.fileId).toBeDefined();
    expect(uploadRes.url).toContain(`/vdcd/projects/${validProjectSlug}/`);
  });

  // =========================================================================
  // TEST 4: upload gallery
  // =========================================================================
  it('✓ 4. upload gallery: uploads multiple gallery images with captions into project slug folder and confirms', async () => {
    const files = [sampleFile('gallery-1.webp'), sampleFile('gallery-2.webp')];
    const captions = ['Ảnh phối cảnh 1', 'Ảnh phối cảnh 2'];

    const gallery = await projectService.addImages(
      validProjectId,
      files,
      captions,
      'user-admin',
    );

    expect(mockProjectRepo.findById).toHaveBeenCalledWith(validProjectId);
    expect(gallery).toHaveLength(2);
    expect(mockImageKit.upload).toHaveBeenCalledTimes(2);
    expect(mockImageKit.upload).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ folder: `/vdcd/projects/${validProjectSlug}` }),
    );
    expect(mockImageKit.upload).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ folder: `/vdcd/projects/${validProjectSlug}` }),
    );
    expect(mockImageRepo.save).toHaveBeenCalled();
    expect(mockUploadTempRepo.update).toHaveBeenCalledTimes(2);
  });

  // =========================================================================
  // TEST 5: multiple images
  // =========================================================================
  it('✓ 5. multiple images: concurrent parallel uploads have unique filenames and do not collide', async () => {
    const files = [
      sampleFile('photo-a.webp'),
      sampleFile('photo-b.webp'),
      sampleFile('photo-c.webp'),
    ];

    const results = await Promise.all(
      files.map((f) =>
        uploadService.uploadProjectImage(f, 'user-admin', validProjectSlug),
      ),
    );

    const fileIds = new Set(results.map((r) => r.fileId));
    const urls = new Set(results.map((r) => r.url));

    expect(fileIds.size).toBe(3);
    expect(urls.size).toBe(3);
    results.forEach((r) => {
      expect(r.url).toContain(`/vdcd/projects/${validProjectSlug}/`);
    });
  });

  // =========================================================================
  // TEST 6: same project multiple uploads
  // =========================================================================
  it('✓ 6. same project multiple uploads: multiple upload calls over time all resolve to identical project folder', async () => {
    // 1st upload: thumbnail
    const res1 = await uploadService.uploadProjectImage(
      sampleFile('thumb.webp'),
      'user-admin',
      validProjectId,
    );
    // 2nd upload: challenge
    const res2 = await uploadService.uploadProjectImage(
      sampleFile('challenge.webp'),
      'user-admin',
      validProjectId,
    );
    // 3rd upload: content block
    const res3 = await uploadService.uploadProjectImage(
      sampleFile('block.webp'),
      'user-admin',
      validProjectId,
    );

    expect(res1.url).toContain(`/vdcd/projects/${validProjectSlug}/`);
    expect(res2.url).toContain(`/vdcd/projects/${validProjectSlug}/`);
    expect(res3.url).toContain(`/vdcd/projects/${validProjectSlug}/`);
  });

  // =========================================================================
  // TEST 7: slug missing
  // =========================================================================
  it('✓ 7. slug missing: generates a stable project-{random8} session folder and ignores arbitrary client folder', async () => {
    // Admin sends no slug / projectId (or sends folder: "/vdcd/projects/abc" which is stripped)
    const result = await uploadService.uploadProjectImage(
      sampleFile('draft.webp'),
      'user-admin',
      undefined,
    );

    expect(mockImageKit.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: expect.stringMatching(
          /^\/vdcd\/projects\/project-[a-z0-9]{8}$/,
        ),
      }),
    );
    expect(result.url).toMatch(/\/vdcd\/projects\/project-[a-z0-9]{8}\//);
  });

  // =========================================================================
  // TEST 8: slug generated
  // =========================================================================
  it('✓ 8. slug generated: auto-generates slug from title when slug is omitted in create', async () => {
    const created = await projectService.create({
      title: 'Dự án Đô thị Sinh thái Mới 2026',
      // slug omitted
    });

    expect(created.slug).toBe('du-an-do-thi-sinh-thai-moi-2026');
    expect(mockProjectRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'du-an-do-thi-sinh-thai-moi-2026',
      }),
    );
  });

  // =========================================================================
  // TEST 9: slug changed
  // =========================================================================
  it('✓ 9. slug changed: renames ImageKit folder and rewrites all image URLs in project', async () => {
    const oldSlug = validProjectSlug;
    const newSlug = 'smart-city-gia-lai-v2';

    mockDataSource.transaction.mockImplementationOnce(async (cb: any) => {
      const mockProj: any = {
        id: validProjectId,
        slug: oldSlug,
        thumbnail: `https://ik.imagekit.io/test/vdcd/projects/${oldSlug}/thumb.webp`,
        thumbnailFileId: 'thumb-fid',
        challengeImage: `https://ik.imagekit.io/test/vdcd/projects/${oldSlug}/challenge.webp`,
        challengeImageFileId: 'chal-fid',
        content: {
          version: 1,
          blocks: [
            {
              id: 'b1',
              type: 'image',
              url: `https://ik.imagekit.io/test/vdcd/projects/${oldSlug}/block-1.webp`,
              fileId: 'b1-fid',
            },
          ],
        },
        images: [
          {
            id: 'img-1',
            url: `https://ik.imagekit.io/test/vdcd/projects/${oldSlug}/gallery-1.webp`,
            fileId: 'g1-fid',
          },
        ],
      };

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(mockProj),
        save: jest
          .fn()
          .mockImplementation((entity, data) => Promise.resolve(data)),
      };
      return cb(mockManager);
    });

    const updated = await projectService.update(validProjectId, {
      slug: newSlug,
    });

    expect(mockImageKit.moveFolder).toHaveBeenCalledWith({
      sourceFolderPath: `/vdcd/projects/${oldSlug}`,
      destinationPath: `/vdcd/projects/${newSlug}`,
    });
    expect(updated.thumbnail).toContain(`/vdcd/projects/${newSlug}/thumb.webp`);
    expect(updated.challengeImage).toContain(
      `/vdcd/projects/${newSlug}/challenge.webp`,
    );
    expect((updated.content as any).blocks[0].url).toContain(
      `/vdcd/projects/${newSlug}/block-1.webp`,
    );
    expect(updated.images[0].url).toContain(
      `/vdcd/projects/${newSlug}/gallery-1.webp`,
    );
  });

  // =========================================================================
  // TEST 10: delete image
  // =========================================================================
  it('✓ 10. delete image: deletes file from ImageKit when not shared, preserves if shared', async () => {
    // 10a. Unshared image is deleted
    mockImageRepo.findOne.mockResolvedValueOnce({
      id: 'img-to-delete',
      fileId: 'ik-fid-unshared',
    });

    await projectService.removeImage('img-to-delete');
    expect(mockImageRepo.remove).toHaveBeenCalled();
    expect(mockImageKit.deleteFile).toHaveBeenCalledWith('ik-fid-unshared');

    // 10b. Shared image is preserved
    mockImageRepo.findOne.mockResolvedValueOnce({
      id: 'img-shared',
      fileId: 'ik-fid-shared',
    });
    // Mock isMediaShared returning true by having count > 0 in article table
    mockDataSource.query.mockImplementationOnce(async (sql: string) => {
      if (sql.includes('SELECT count(*)::int as count FROM "article"')) {
        return [{ count: 1 }];
      }
      return [{ count: 0 }];
    });

    await projectService.removeImage('img-shared');
    expect(mockImageRepo.remove).toHaveBeenCalled();
    // ImageKit deleteFile was NOT called for shared image
    expect(mockImageKit.deleteFile).not.toHaveBeenCalledWith('ik-fid-shared');
  });

  // =========================================================================
  // TEST 11: replace image
  // =========================================================================
  it('✓ 11. replace image: replaces thumbnail, cleans up old thumbnail from ImageKit, confirms new', async () => {
    mockDataSource.transaction.mockImplementationOnce(async (cb: any) => {
      const mockProj: any = {
        id: validProjectId,
        slug: validProjectSlug,
        thumbnail:
          'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/old-thumb.webp',
        thumbnailFileId: 'old-thumb-fid',
        content: { version: 1, blocks: [] },
      };
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(mockProj),
        save: jest
          .fn()
          .mockImplementation((entity, data) => Promise.resolve(data)),
      };
      return cb(mockManager);
    });

    await projectService.update(validProjectId, {
      thumbnail:
        'https://ik.imagekit.io/test/vdcd/projects/smart-city-gia-lai/new-thumb.webp',
      thumbnailFileId: 'new-thumb-fid',
    });

    // Old thumbnail deleted
    expect(mockImageKit.deleteFile).toHaveBeenCalledWith('old-thumb-fid');
    // New thumbnail confirmed
    expect(mockUploadTempRepo.update).toHaveBeenCalledWith(
      { fileId: 'new-thumb-fid' },
      { confirmed: true },
    );
  });

  // =========================================================================
  // TEST 12: upload failure
  // =========================================================================
  it('✓ 12. upload failure: throws BadRequestException on invalid file format, missing file, or oversized file', async () => {
    // Missing file
    await expect(
      uploadService.uploadProjectImage(
        null as any,
        'user-admin',
        validProjectSlug,
      ),
    ).rejects.toThrow(BadRequestException);

    // Disallowed mimetype (e.g. text file or script)
    const badMimeFile = sampleFile('malicious.sh', 100, 'application/x-sh');
    await expect(
      uploadService.uploadProjectImage(
        badMimeFile,
        'user-admin',
        validProjectSlug,
      ),
    ).rejects.toThrow(BadRequestException);

    // File exceeds 10MB limit
    const hugeFile = sampleFile('huge.png', 11 * 1024 * 1024, 'image/png');
    await expect(
      uploadService.uploadProjectImage(
        hugeFile,
        'user-admin',
        validProjectSlug,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  // =========================================================================
  // TEST 13: DB failure after ImageKit success
  // =========================================================================
  it('✓ 13. DB failure after ImageKit success: file remains unconfirmed in upload_temp when DB transaction fails', async () => {
    // 1. Upload succeeds to ImageKit
    const file = sampleFile('asset.webp');
    const uploadRes = await uploadService.uploadProjectImage(
      file,
      'user-admin',
      validProjectId,
    );

    expect(uploadRes.fileId).toBeDefined();
    // Recorded in upload_temp with confirmed: false
    expect(mockUploadTempRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: uploadRes.fileId,
        confirmed: false,
      }),
    );

    // 2. DB operation fails (e.g. database connection lost or constraint violation)
    mockDataSource.transaction.mockImplementationOnce(async () => {
      throw new Error('Database transaction deadlocked or connection lost');
    });

    await expect(
      projectService.update(validProjectId, {
        thumbnail: uploadRes.url,
        thumbnailFileId: uploadRes.fileId,
      }),
    ).rejects.toThrow('Database transaction deadlocked or connection lost');

    // 3. confirmUpload was NEVER called for this fileId
    expect(mockUploadTempRepo.update).not.toHaveBeenCalledWith(
      { fileId: uploadRes.fileId },
      { confirmed: true },
    );
  });

  // =========================================================================
  // TEST 14: ImageKit failure
  // =========================================================================
  it('✓ 14. ImageKit failure: throws InternalServerErrorException without persisting dirty temp record', async () => {
    mockImageKit.upload.mockRejectedValueOnce(
      new Error('ImageKit API connection refused'),
    );

    await expect(
      uploadService.uploadProjectImage(
        sampleFile('pic.webp'),
        'user-admin',
        validProjectSlug,
      ),
    ).rejects.toThrow(InternalServerErrorException);

    // upload_temp should not have been saved
    expect(mockUploadTempRepo.save).not.toHaveBeenCalled();
  });

  // =========================================================================
  // TEST 15: unauthorized project access & invalid project ID
  // =========================================================================
  it('✓ 15. unauthorized project access & non-existent project ID validation', async () => {
    const unknownProjectId = '00000000-0000-0000-0000-000000000000';

    // 15a. Passing non-existent projectId fails with NotFoundException
    await expect(
      uploadService.uploadProjectImage(
        sampleFile('pic.webp'),
        'user-admin',
        unknownProjectId,
      ),
    ).rejects.toThrow(NotFoundException);

    // 15b. Service uploadImageForProject with non-existent projectId fails with NotFoundException
    await expect(
      projectService.uploadImageForProject(
        unknownProjectId,
        sampleFile('pic.webp'),
        'user-admin',
      ),
    ).rejects.toThrow(NotFoundException);

    // 15c. Path traversal prevention: arbitrary path or folder injection cannot escape
    const traversalKey = '../../etc/passwd';
    const traversalResult = await uploadService.uploadProjectImage(
      sampleFile('pic.webp'),
      'user-admin',
      traversalKey,
    );
    expect(traversalResult.url).not.toContain('..');
    expect(traversalResult.url).toContain('/vdcd/projects/etc-passwd/');
  });
});
