// src/modules/article/entities/article.entity.ts
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
import { Project } from '../../project/entities/project.entity';
import { Program } from '../../program/entities/program.entity';
import { Solution } from '../../solution/entities/solution.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail: string | null;

  @Column({ type: 'varchar', name: 'thumbnail_file_id', nullable: true })
  thumbnailFileId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index('IDX_article_category')
  category: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags: string | null;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project: Project | null;

  @ManyToOne(() => Program, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'program_id' })
  program: Program | null;

  @ManyToOne(() => Solution, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'solution_id' })
  solution: Solution | null;

  @Column({ type: 'varchar', name: 'meta_title', length: 255, nullable: true })
  metaTitle: string | null;

  @Column({
    type: 'varchar',
    name: 'meta_description',
    length: 500,
    nullable: true,
  })
  metaDescription: string | null;

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

  @Column({ name: 'is_published', default: false })
  @Index('IDX_article_is_published')
  isPublished: boolean;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  @Index('IDX_article_published_at')
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
