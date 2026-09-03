// src/modules/slide/entities/slide.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { SlideDetailBlog } from '../../slide-detail-blog/entities/slide-detail-blog.entity';

@Entity('slide')
export class Slide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', name: 'cta_text', length: 100, nullable: true })
  ctaText: string | null;

  @Column({ type: 'varchar', name: 'cta_url', length: 500, nullable: true })
  ctaUrl: string | null;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', name: 'image_file_id', nullable: true })
  imageFileId: string | null;

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => SlideDetailBlog, (blog) => blog.slide)
  detailBlog: SlideDetailBlog;
}
