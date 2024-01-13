import { IsEmail, Min } from 'class-validator';
import { Order } from 'src/orders/entities/orders.entity';
import { Point } from 'src/points/entities/points.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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
  fixedRate: number;
  @Column()
  percentFromEarnings: number;
  @CreateDateColumn()
  dateOfEmployment: Date;
  @ManyToMany()
  point: Point[];
  @OneToMany()
  shifts: Shift[];
  @OneToMany()
  orders: Order[];
}
