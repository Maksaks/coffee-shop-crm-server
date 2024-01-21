import { Admin } from 'src/admin/entities/admin.entity';
import { Barista } from 'src/barista/entities/barista.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
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
  @Column({ default: 0 })
  pointMoney: number;
  @ManyToMany(() => Barista, (barista) => barista.points, {
    onDelete: 'SET NULL',
  })
  barista: Barista[];
  @OneToMany(() => Order, (order) => order.point)
  @JoinColumn({ name: 'orders_id' })
  orders: Order[];
  @OneToMany(() => Ingredient, (ingredient) => ingredient.point, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredients_id' })
  ingredients: Ingredient[];
  @ManyToOne(() => Admin, (admin) => admin.points, {
    onDelete: 'SET NULL',
  })
  admin: Admin;
  @OneToMany(() => Shift, (shift) => shift.point, {
    onDelete: 'SET NULL',
  })
  shifts: Shift[];
  @OneToMany(() => MenuPosition, (position) => position.point, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'menuPositions_id' })
  menuPositions: MenuPosition[];
}
