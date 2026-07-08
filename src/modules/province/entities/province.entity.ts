import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('province')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 10 })
  code: string;

  @Column({ name: 'has_project', default: false })
  hasProject: boolean;

  @Column({ name: 'center_count', default: 0 })
  centerCount: number;
}
