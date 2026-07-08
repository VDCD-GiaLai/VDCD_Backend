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

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne(() => OperationField, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'field_id' })
  field: OperationField;

  @ManyToOne(() => Province, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @Column({ nullable: true })
  year: number;

  @Column({ name: 'meta_title', length: 60, nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', length: 160, nullable: true })
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
