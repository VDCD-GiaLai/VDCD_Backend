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

  @Column({ name: 'business_license_no', length: 50, nullable: true })
  businessLicenseNo: string;

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

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  stats: Record<string, any>;

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks: Record<string, any>;

  @Column({ name: 'operation_fields', type: 'jsonb', nullable: true })
  operationFields: Array<{ title: string; description: string }>;

  @Column({ name: 'ecosystem_capabilities', type: 'text', nullable: true })
  ecosystemCapabilities: string;

  @Column({ name: 'development_orientations', type: 'jsonb', nullable: true })
  developmentOrientations: Array<{ title: string; description: string }>;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
