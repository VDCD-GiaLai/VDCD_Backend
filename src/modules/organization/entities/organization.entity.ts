import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  tagline: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  mission: string;

  @Column({ type: 'text', nullable: true })
  vision: string;

  @Column({ name: 'core_values', type: 'text', nullable: true })
  coreValues: string;

  @Column({ name: 'founded_year', nullable: true })
  foundedYear: number;

  @Column({ type: 'jsonb', nullable: true })
  stats: Record<string, any>;

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks: Record<string, any>;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
