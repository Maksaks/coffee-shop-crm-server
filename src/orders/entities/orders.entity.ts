import { Barista } from 'src/barista/entities/barista.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Point } from 'src/points/entities/points.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatus {
  InProgress = 'In Progress',
  Ready = 'Ready',
}

export enum PaymentMethod {
  ByCash = 'By Cash',
  ByCard = 'By Card',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.InProgress })
  status: OrderStatus;
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.ByCash })
  paymentMethod: PaymentMethod;
  @Column()
  totalAmount: number;
  @Column()
  receivedAmount: number;
  @Column()
  costOfIngredients: number;
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
  @OneToMany(() => OrderPosition, (orderPos) => orderPos.order, {
    onDelete: 'SET NULL',
  })
  orderList: OrderPosition[];
}
