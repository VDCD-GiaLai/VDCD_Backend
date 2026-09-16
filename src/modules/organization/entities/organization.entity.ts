import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

export interface OrganizationLeader {
  name?: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  avatarFileId?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface OrganizationAnnouncement {
  text: string;
  link?: string;
  isActive?: boolean;
  imageUrl?: string;
  imageFileId?: string;
}

export interface OrganizationStatItem {
  key?: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface OrganizationCoreValueItem {
  title: string;
  description?: string;
  icon?: string;
}

export interface OrganizationEcosystemMember {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
  order?: number;
}

export interface OrganizationCtaSection {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  subtext?: string;
}

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'short_name', length: 100, nullable: true })
  shortName: string;

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

  @Column({ name: 'core_values_list', type: 'jsonb', nullable: true })
  coreValuesList: OrganizationCoreValueItem[];

  @Column({ name: 'founded_year', nullable: true })
  foundedYear: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  hotline: string;

  @Column({ type: 'jsonb', nullable: true })
  announcement: OrganizationAnnouncement;

  @Column({ type: 'jsonb', nullable: true })
  leader: OrganizationLeader;

  @Column({ type: 'jsonb', nullable: true })
  stats: Record<string, any>;

  @Column({ name: 'stats_list', type: 'jsonb', nullable: true })
  statsList: OrganizationStatItem[];

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks: Record<string, any>;

  @Column({ name: 'operation_fields', type: 'jsonb', nullable: true })
  operationFields: Array<{
    title: string;
    description: string;
    icon?: string;
    imageUrl?: string;
    order?: number;
  }>;

  @Column({ name: 'ecosystem_capabilities', type: 'text', nullable: true })
  ecosystemCapabilities: string;

  @Column({ name: 'ecosystem_members', type: 'jsonb', nullable: true })
  ecosystemMembers: OrganizationEcosystemMember[];

  @Column({ name: 'development_orientations', type: 'jsonb', nullable: true })
  developmentOrientations: Array<{
    title: string;
    description: string;
    icon?: string;
    order?: number;
  }>;

  @Column({ name: 'cta_section', type: 'jsonb', nullable: true })
  ctaSection: OrganizationCtaSection;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
