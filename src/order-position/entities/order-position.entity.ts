import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Order } from 'src/orders/entities/orders.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderPosition {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => MenuPosition, (position) => position.orderPositions, {
    onDelete: 'SET NULL',
  })
  menuPosition: MenuPosition;
  @Column()
  quantity: number;
  @ManyToOne(() => Order, (order) => order.orderList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
