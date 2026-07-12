import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('upload_temp')
export class UploadTemp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_id' })
  fileId: string;

  @Column()
  url: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ default: false })
  confirmed: boolean;

  // Admin upload — to audit
  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
