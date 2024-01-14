import { Category } from 'src/categories/entities/category.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { PositionDiscount } from 'src/position-discount/entities/position-discount.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
  @ManyToMany(() => Order, (order) => order.menuPositions, {
    onDelete: 'SET NULL',
  })
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
}
