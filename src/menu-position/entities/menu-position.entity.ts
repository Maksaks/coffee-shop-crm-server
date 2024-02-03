import { Category } from 'src/categories/entities/category.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Point } from 'src/points/entities/points.entity';
import { PositionDiscount } from 'src/position-discount/entities/position-discount.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
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
    eager: true,
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
  @OneToMany(() => OrderPosition, (orderPos) => orderPos.menuPosition, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  orderPositions: OrderPosition[];
  @OneToOne(() => PositionDiscount, (discount) => discount.menuPosition, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'discount_id' })
  discount: PositionDiscount;
  @ManyToOne(() => Category, (category) => category.positions, {
    onDelete: 'SET NULL',
    eager: true,
  })
  category: Category;
  @ManyToOne(() => Point, (point) => point.menuPositions, {
    onDelete: 'SET NULL',
  })
  point: Point;
}
