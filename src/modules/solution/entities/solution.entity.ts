// src/modules/solution/entities/solution.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { OperationField } from '../../operation-field/entities/operation-field.entity';

@Entity('solution')
export class Solution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string | null;

  // ── Block-based structured JSON document ───────────────────────────
  @Column({
    type: 'jsonb',
    default: () => `'{"version":1,"blocks":[]}'`,
  })
  content: Record<string, any>;

  @Column({
    name: 'content_html_backup',
    type: 'text',
    nullable: true,
    select: false,
  })
  contentHtmlBackup: string | null;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string | null;

  @Column({ name: 'website_url', type: 'varchar', nullable: true })
  websiteUrl: string | null;

  @Column({ name: 'thumbnail_file_id', type: 'varchar', nullable: true })
  thumbnailFileId: string | null;

  @ManyToOne(() => OperationField, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'field_id' })
  @Index('IDX_solution_field_id')
  field: OperationField | null;

  @Column({ name: 'meta_title', type: 'varchar', length: 255, nullable: true })
  metaTitle: string | null;

  @Column({
    name: 'meta_description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  metaDescription: string | null;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  @Index('IDX_solution_is_published')
  isPublished: boolean;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  @Index('IDX_solution_published_at')
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
