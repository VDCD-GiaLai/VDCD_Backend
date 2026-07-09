import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('admin_user')
export class AdminUser {
  @ApiProperty({
    example: 'd3b07384-d113-4956-a5db-e78119d90184',
    description: 'Account ID (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'admin_user', description: 'Username' })
  @Column({ length: 100, unique: true })
  username: string;

  @ApiProperty({ example: 'admin@vdcd.vn', description: 'Email address' })
  @Column({ length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @ApiProperty({
    example: 'editor',
    description: 'Account role',
    enum: ['superadmin', 'editor', 'viewer'],
  })
  @Column({ default: 'editor' })
  role: string;

  @ApiProperty({
    example: true,
    description: 'Active status of the user account',
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2026-07-09T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2026-07-09T12:00:00.000Z',
    description: 'Last update timestamp',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
