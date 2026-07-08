import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('operation_field')
export class OperationField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string;

  @Column({ default: 0 })
  order: number;
}
