import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Program } from '../../program/entities/program.entity';
import { Solution } from '../../solution/entities/solution.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  tags: string;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Program, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => Solution, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'solution_id' })
  solution: Solution;

  @Column({ name: 'meta_title', length: 60, nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', length: 160, nullable: true })
  metaDescription: string;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'published_at', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
