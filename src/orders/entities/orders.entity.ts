import { Barista } from 'src/barista/entities/barista.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Point } from 'src/points/entities/points.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatus {
  InProgress = 'In Progress',
  Ready = 'Ready',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.InProgress })
  status: OrderStatus;
  @Column()
  totalAmount: number;
  @ManyToOne(() => Barista, (barista) => barista.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'barista_id' })
  barista: Barista;
  @ManyToOne(() => Point, (point) => point.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'point_id' })
  point: Point;
  @ManyToMany(() => MenuPosition, (position) => position.orders, {
    onDelete: 'SET NULL',
  })
  menuPositions: MenuPosition[];
}
