import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @OneToOne(() => MenuPosition, (position) => position.discount, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'position_id' })
  menuPosition: MenuPosition;
}
