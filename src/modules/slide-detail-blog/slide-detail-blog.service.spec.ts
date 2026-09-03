// src/modules/slide-detail-blog/slide-detail-blog.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SlideDetailBlogService } from './slide-detail-blog.service';
import { SlideDetailBlog } from './entities/slide-detail-blog.entity';
import { Slide } from '../slide/entities/slide.entity';
import { UploadService } from '../upload/upload.service';

/** ── Fixtures ─────────────────────────────────── */
const PUBLISHED_BLOG: Partial<SlideDetailBlog> = {
  id: 'blog-uuid-1',
  title: 'Số Hóa Dữ Liệu Đất Đai',
  slug: 'so-hoa-du-lieu-dat-dai',
  subtitle: 'Từ hiện trạng đến cơ sở dữ liệu',
  excerpt: 'Ứng dụng UAV, AI và GIS…',
  heroImageUrl: 'https://ik.imagekit.io/vdcd/hero.jpg',
  seoTitle: 'Số hóa dữ liệu đất đai | VDCD',
  metaDescription: 'Ứng dụng UAV, AI và GIS để đo đạc.',
  content: {
    version: 1,
    blocks: [{ id: 'b1', type: 'paragraph', text: 'Hello' }],
  },
  isPublished: true,
  publishedAt: new Date('2026-08-01'),
};

/** ── Mock repos ──────────────────────────────── */
const mockRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockSlideRepo = {
  findOne: jest.fn(),
};

const mockUploadService = {
  confirmUpload: jest.fn().mockResolvedValue(undefined),
  deleteFile: jest.fn().mockResolvedValue(undefined),
};

describe('SlideDetailBlogService — findBySlug (public)', () => {
  let service: SlideDetailBlogService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlideDetailBlogService,
        { provide: getRepositoryToken(SlideDetailBlog), useValue: mockRepo },
        { provide: getRepositoryToken(Slide), useValue: mockSlideRepo },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    service = module.get(SlideDetailBlogService);
  });

  it('should return published blog with only public fields', async () => {
    const publicBlog = { ...PUBLISHED_BLOG };
    delete (publicBlog as any).isPublished;
    mockRepo.findOne.mockResolvedValueOnce(publicBlog);

    const result = await service.findBySlug('so-hoa-du-lieu-dat-dai');

    expect(result).toBeDefined();
    expect(result.id).toBe('blog-uuid-1');
    expect(result.title).toBe('Số Hóa Dữ Liệu Đất Đai');
    expect(result.slug).toBe('so-hoa-du-lieu-dat-dai');
    expect(result.content).toBeDefined();
    expect(result.publishedAt).toBeDefined();
    // Verify select was called with public fields only
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { slug: 'so-hoa-du-lieu-dat-dai', isPublished: true },
      select: expect.objectContaining({
        id: true,
        title: true,
        slug: true,
        content: true,
        publishedAt: true,
      }),
    });
    // Verify no slide relation loaded
    expect(mockRepo.findOne).toHaveBeenCalledWith(
      expect.not.objectContaining({ relations: expect.anything() }),
    );
  });

  it('should return 404 for draft blog (isPublished=false)', async () => {
    // Draft won't match isPublished: true query
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.findBySlug('draft-blog')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepo.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'draft-blog', isPublished: true },
      }),
    );
  });

  it('should return 404 for non-existent slug', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.findBySlug('non-existent-slug')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return 404 for deleted blog (hard-deleted, not in DB)', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.findBySlug('deleted-slug')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return content blocks correctly', async () => {
    const blogWithBlocks = {
      ...PUBLISHED_BLOG,
      content: {
        version: 1,
        blocks: [
          { id: 'h1', type: 'heading', level: 2, text: 'Giới thiệu' },
          { id: 'p1', type: 'paragraph', text: 'Nội dung chi tiết...' },
          {
            id: 'img1',
            type: 'image',
            url: 'https://img.jpg',
            fileId: null,
            alt: 'Alt',
            caption: null,
          },
          { id: 'l1', type: 'list', items: ['Item 1', 'Item 2'] },
          {
            id: 's1',
            type: 'section',
            number: '01',
            title: 'Phần 1',
            children: [],
          },
          { id: 'c1', type: 'cta', label: 'Liên hệ', url: '/contact' },
        ],
      },
    };
    mockRepo.findOne.mockResolvedValueOnce(blogWithBlocks);

    const result = await service.findBySlug('so-hoa-du-lieu-dat-dai');

    expect(result.content).toEqual(blogWithBlocks.content);
    expect((result.content as any).blocks).toHaveLength(6);
    expect((result.content as any).blocks[0].type).toBe('heading');
    expect((result.content as any).blocks[5].type).toBe('cta');
  });

  it('should include SEO-critical fields', async () => {
    mockRepo.findOne.mockResolvedValueOnce(PUBLISHED_BLOG);

    const result = await service.findBySlug('so-hoa-du-lieu-dat-dai');

    // seoTitle for document title
    expect(result.seoTitle).toBe('Số hóa dữ liệu đất đai | VDCD');
    // metaDescription for meta tag
    expect(result.metaDescription).toBe('Ứng dụng UAV, AI và GIS để đo đạc.');
    // slug for canonical URL
    expect(result.slug).toBe('so-hoa-du-lieu-dat-dai');
    // heroImageUrl for og:image
    expect(result.heroImageUrl).toBe('https://ik.imagekit.io/vdcd/hero.jpg');
  });
});
