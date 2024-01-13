import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PositionDiscount {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  amount: number;
  @CreateDateColumn()
  startedAt: Date;
  @Column({ type: 'timestamptz' })
  endAt: Date;
  @OneToOne()
  menuPosition: MenuPosition;
}
