import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_image')
export class ProjectImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'file_id', nullable: true })
  fileId: string;
}
