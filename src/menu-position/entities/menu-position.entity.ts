import { Order } from 'src/orders/entities/orders.entity';
import { PositionDiscount } from 'src/position-discount/entities/position-discount.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MenuPosition {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  price: number;
  @OneToOne()
  recipe: Recipe;
  @ManyToMany()
  orders: Order[];
  @OneToOne()
  disctount: PositionDiscount;
}
