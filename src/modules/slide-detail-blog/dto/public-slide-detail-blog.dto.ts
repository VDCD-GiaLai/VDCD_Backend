// src/modules/slide-detail-blog/dto/public-slide-detail-blog.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * Public response DTO for SlideDetailBlog.
 * Only exposes fields needed by the frontend for rendering + SEO.
 * Internal fields (slideId, heroImageFileId, isPublished, createdAt, updatedAt) are excluded.
 */
@Exclude()
export class PublicSlideDetailBlogDto {
  @Expose()
  @ApiProperty({ description: 'Blog UUID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Blog title (H1)', maxLength: 255 })
  title: string;

  @Expose()
  @ApiProperty({ description: 'URL-friendly slug', maxLength: 255 })
  slug: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Subtitle / tagline' })
  subtitle: string | null;

  @Expose()
  @ApiPropertyOptional({ description: 'Short excerpt for listing / SEO' })
  excerpt: string | null;

  @Expose()
  @ApiPropertyOptional({ description: 'Hero image URL' })
  heroImageUrl: string | null;

  @Expose()
  @ApiPropertyOptional({ description: 'SEO title tag' })
  seoTitle: string | null;

  @Expose()
  @ApiPropertyOptional({ description: 'SEO meta description' })
  metaDescription: string | null;

  @Expose()
  @ApiProperty({ description: 'Block-based structured content (JSONB)' })
  content: Record<string, unknown>;

  @Expose()
  @ApiPropertyOptional({ description: 'First publish timestamp' })
  publishedAt: Date | null;
}
