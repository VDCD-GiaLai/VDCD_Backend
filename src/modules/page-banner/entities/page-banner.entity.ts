// src/modules/page-banner/entities/page-banner.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface PageBannerCtaButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | (string & {});
  ariaLabel?: string;
}

@Entity('page_banner')
export class PageBanner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'page_key', length: 50, unique: true })
  pageKey: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tag: string | null;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', name: 'image_file_id', nullable: true })
  imageFileId: string | null;

  @Column({ type: 'jsonb', name: 'cta_buttons', nullable: true })
  ctaButtons: PageBannerCtaButton[] | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
