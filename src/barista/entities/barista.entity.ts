import { IsEmail, Min } from 'class-validator';
import { Admin } from 'src/admin/entities/admin.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Point } from 'src/points/entities/points.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Barista {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column()
  @IsEmail()
  email: string;
  @Column()
  phoneNumber: string;
  @Column()
  @Min(8)
  password: string;
  @Column()
  fixedHourRate: number;
  @Column()
  percentFromEarnings: number;
  @CreateDateColumn()
  dateOfEmployment: Date;
  @ManyToMany(() => Point, (point) => point.barista, {
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  points: Point[];
  @OneToMany(() => Shift, (shift) => shift.barista, { onDelete: 'SET NULL' })
  shifts: Shift[];
  @OneToMany(() => Order, (order) => order.barista, { onDelete: 'SET NULL' })
  orders: Order[];
  @ManyToOne(() => Admin, (admin) => admin.baristas, { onDelete: 'SET NULL' })
  admin: Admin;
}
