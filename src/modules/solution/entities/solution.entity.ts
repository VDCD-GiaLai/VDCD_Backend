// src/modules/solution/entities/solution.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationField } from '../../operation-field/entities/operation-field.entity';

@Entity('solution')
export class Solution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ name: 'thumbnail_file_id', nullable: true })
  thumbnailFileId: string;

  @ManyToOne(() => OperationField, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'field_id' })
  field: OperationField;

  @Column({ name: 'meta_title', length: 255, nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', length: 255, nullable: true })
  metaDescription: string;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
