// src/modules/slide-detail-blog/entities/slide-detail-blog.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Slide } from '../../slide/entities/slide.entity';

@Entity('slide_detail_blog')
export class SlideDetailBlog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'slide_id', type: 'uuid' })
  @Index('IDX_slide_detail_blog_slide_id', { unique: true })
  slideId: string;

  @OneToOne(() => Slide, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slide_id' })
  slide: Slide;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string | null;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({
    type: 'varchar',
    name: 'hero_image_url',
    length: 500,
    nullable: true,
  })
  heroImageUrl: string | null;

  @Column({
    type: 'varchar',
    name: 'hero_image_file_id',
    nullable: true,
  })
  heroImageFileId: string | null;

  @Column({ type: 'varchar', name: 'seo_title', length: 255, nullable: true })
  seoTitle: string | null;

  @Column({
    type: 'varchar',
    name: 'meta_description',
    length: 500,
    nullable: true,
  })
  metaDescription: string | null;

  @Column({
    type: 'jsonb',
    default: () => `'{"version":1,"blocks":[]}'`,
  })
  content: Record<string, any>;

  @Column({ name: 'is_published', default: false })
  @Index('IDX_slide_detail_blog_is_published')
  isPublished: boolean;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  @Index('IDX_slide_detail_blog_published_at')
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
