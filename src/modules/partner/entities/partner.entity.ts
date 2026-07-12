// src/modules/partner/entities/partner.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('partner')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500 })
  logo: string;

  @Column({ name: 'website_url', length: 500, nullable: true })
  websiteUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'logo_file_id', nullable: true })
  logoFileId: string;
}
