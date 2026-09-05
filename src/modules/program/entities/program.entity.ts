// src/modules/program/entities/program.entity.ts
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

@Entity('program')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', name: 'thumbnail_file_id', nullable: true })
  thumbnailFileId: string | null;

  @Column({ type: 'text', name: 'short_description', nullable: true })
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

  @ManyToOne(() => OperationField, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'field_id' })
  @Index('IDX_program_field_id')
  field: OperationField | null;

  @Column({ type: 'varchar', name: 'meta_title', length: 255, nullable: true })
  metaTitle: string | null;

  @Column({
    type: 'varchar',
    name: 'meta_description',
    length: 255,
    nullable: true,
  })
  metaDescription: string | null;

  @Column({ type: 'boolean', name: 'is_published', default: false })
  @Index('IDX_program_is_published')
  isPublished: boolean;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  @Index('IDX_program_published_at')
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
