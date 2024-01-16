import { Admin } from 'src/admin/entities/admin.entity';
import { Barista } from 'src/barista/entities/barista.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Order } from 'src/orders/entities/orders.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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
  @ManyToMany(() => Barista, (barista) => barista.points, {
    onDelete: 'SET NULL',
  })
  barista: Barista[];
  @OneToMany(() => Order, (order) => order.point, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orders_id' })
  orders: Order[];
  @OneToMany(() => Ingredient, (ingredient) => ingredient.point, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredients_id' })
  ingredients: Ingredient[];
  @ManyToOne(() => Admin, (admin) => admin.points, { onDelete: 'SET NULL' })
  admin: Admin;
}
