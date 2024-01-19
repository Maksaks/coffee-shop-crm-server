import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Point } from 'src/points/entities/points.entity';
import { PositionDiscount } from 'src/position-discount/entities/position-discount.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  @OneToOne(() => Recipe, (recipe) => recipe.menuPosition, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
  @ManyToMany(() => Order, (order) => order.menuPositions, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  orders: Order[];
  @OneToOne(() => PositionDiscount, (discount) => discount.menuPosition, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discount_id' })
  discount: PositionDiscount;
  @ManyToOne(() => Category, (category) => category.positions, {
    onDelete: 'SET NULL',
  })
  category: Category;
  @ManyToOne(() => Point, (point) => point.menuPositions, {
    onDelete: 'SET NULL',
  })
  point: Point;
}
