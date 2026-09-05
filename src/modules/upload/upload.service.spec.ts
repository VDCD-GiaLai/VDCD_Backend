import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UploadService, UploadResult } from './upload.service';
import { UploadTemp } from './entities/upload-temp.entity';

describe('UploadService', () => {
  let service: UploadService;

  const mockRepo = {
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'imagekit.publicKey') return 'test_public_key';
      if (key === 'imagekit.privateKey') return 'test_private_key';
      if (key === 'imagekit.urlEndpoint') return 'https://ik.imagekit.io/test';
      return '';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: getRepositoryToken(UploadTemp), useValue: mockRepo },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  describe('sanitizeSubfolder', () => {
    it('should return empty string for undefined or empty input', () => {
      expect(service.sanitizeSubfolder()).toBe('');
      expect(service.sanitizeSubfolder('')).toBe('');
      expect(service.sanitizeSubfolder('   ')).toBe('');
    });

    it('should convert Vietnamese accents and special characters to slug', () => {
      expect(service.sanitizeSubfolder('bài-viết')).toBe('bai-viet');
      expect(service.sanitizeSubfolder('Bài Viết Chi Tiết 2026!')).toBe(
        'bai-viet-chi-tiet-2026',
      );
      expect(service.sanitizeSubfolder('Số Hóa Dữ Liệu')).toBe(
        'so-hoa-du-lieu',
      );
    });

    it('should handle nested paths and strip dangerous segments', () => {
      expect(service.sanitizeSubfolder('bai-viet/anh-chinh')).toBe(
        'bai-viet/anh-chinh',
      );
      expect(service.sanitizeSubfolder('../unsafe/path')).toBe('unsafe/path');
      expect(service.sanitizeSubfolder('/leading/and/trailing/')).toBe(
        'leading/and/trailing',
      );
    });
  });

  describe('uploadSlideImage folder target', () => {
    it('should call uploadImage with "slides" when subfolder is omitted', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadSlideImage(fakeFile, 'user-1');

      expect(spy).toHaveBeenCalledWith(fakeFile, 'slides', 'user-1');
    });

    it('should call uploadImage with sanitized subfolder when provided', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadSlideImage(fakeFile, 'user-1', 'bài-viết');

      expect(spy).toHaveBeenCalledWith(fakeFile, 'slides/bai-viet', 'user-1');
    });
  });

  describe('uploadSlideDetailBlogImage folder target', () => {
    it('should default to "slides/detail-blogs" when subfolder is omitted', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadSlideDetailBlogImage(fakeFile, 'user-1');

      expect(spy).toHaveBeenCalledWith(
        fakeFile,
        'slides/detail-blogs',
        'user-1',
      );
    });

    it('should use sanitized subfolder when provided', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadSlideDetailBlogImage(
        fakeFile,
        'user-1',
        'dự-án-becamex',
      );

      expect(spy).toHaveBeenCalledWith(
        fakeFile,
        'slides/du-an-becamex',
        'user-1',
      );
    });
  });

  describe('uploadArticleImage folder target', () => {
    it('should use sanitized slug when slug/title is provided', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadArticleImage(
        fakeFile,
        'user-1',
        'Chuyển Đổi Số Gia Lai 2026',
      );

      expect(spy).toHaveBeenCalledWith(
        fakeFile,
        'articles/chuyen-doi-so-gia-lai-2026',
        'user-1',
      );
    });

    it('should generate a random subfolder when slug/title is omitted or empty', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadArticleImage(fakeFile, 'user-1', '');

      expect(spy).toHaveBeenCalledWith(
        fakeFile,
        expect.stringMatching(/^articles\/[a-f0-9]{10}$/),
        'user-1',
      );
    });

    it('should generate a random subfolder when slug/title is undefined', async () => {
      const spy = jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce({} as UploadResult);

      const fakeFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
        originalname: 'test.jpg',
      } as Express.Multer.File;

      await service.uploadArticleImage(fakeFile, 'user-1');

      expect(spy).toHaveBeenCalledWith(
        fakeFile,
        expect.stringMatching(/^articles\/[a-f0-9]{10}$/),
        'user-1',
      );
    });
  });
});
