import { Barista } from 'src/barista/entities/barista.entity';
import { Order } from 'src/orders/entities/orders.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  description: string;
  @Column()
  workingHours: string;
  @ManyToMany()
  barista: Barista[];
  @OneToMany()
  orders: Order[];
}
