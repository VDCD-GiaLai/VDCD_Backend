import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('lead')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true, length: 255 })
  address: string;

  @Column({ name: 'experience_years', nullable: true, length: 100 })
  experienceYears: string;

  @Column({ name: 'expected_salary', nullable: true, length: 100 })
  expectedSalary: string;

  @Column({ name: 'portfolio_url', nullable: true, length: 500 })
  portfolioUrl: string;

  @Column({ name: 'cover_letter', type: 'text', nullable: true })
  coverLetter: string;

  @Column({ nullable: true, length: 50 })
  source: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
