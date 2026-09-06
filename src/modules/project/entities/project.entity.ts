import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationField } from '../../operation-field/entities/operation-field.entity';
import { Province } from '../../province/entities/province.entity';
import { ProjectImage } from './project-image.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true })
  slug: string;

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

  /** @deprecated Migrated into content block document */
  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne(() => OperationField, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'field_id' })
  field: OperationField;

  @Column({ name: 'thumbnail_file_id', nullable: true })
  thumbnailFileId: string;

  @ManyToOne(() => Province, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @Column({ nullable: true })
  year: number;

  // ── Detail page fields ──────────────────────────────────────

  @Column({ type: 'text', nullable: true })
  challenge: string;

  @Column({ name: 'challenge_image', nullable: true })
  challengeImage: string;

  @Column({ name: 'challenge_image_file_id', nullable: true })
  challengeImageFileId: string;

  @Column({ type: 'simple-array', nullable: true })
  services: string[];

  @Column({ nullable: true })
  discipline: string;

  @Column({ name: 'transformation_before', nullable: true })
  transformationBefore: string;

  @Column({ name: 'transformation_before_file_id', nullable: true })
  transformationBeforeFileId: string;

  @Column({ name: 'transformation_after', nullable: true })
  transformationAfter: string;

  @Column({ name: 'transformation_after_file_id', nullable: true })
  transformationAfterFileId: string;

  @Column({ name: 'technical_highlights', type: 'jsonb', nullable: true })
  technicalHighlights: { label: string; value: string }[];

  @Column({ name: 'next_project_slug', nullable: true })
  nextProjectSlug: string;

  // ── SEO & Publishing ────────────────────────────────────────

  @Column({ name: 'meta_title', length: 255, nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  metaDescription: string;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @OneToMany(() => ProjectImage, (img) => img.project, { cascade: true })
  images: ProjectImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
