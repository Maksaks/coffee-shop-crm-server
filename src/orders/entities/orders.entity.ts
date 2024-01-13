import { Barista } from 'src/barista/entities/barista.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Point } from 'src/points/entities/points.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

enum OrderStatus {
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
  @ManyToOne()
  barista: Barista;
  @ManyToOne()
  point: Point;
  @ManyToMany()
  menuPositions: MenuPosition[];
}
