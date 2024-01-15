import { Min } from 'class-validator';
import { Point } from 'src/points/entities/points.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  @Min(0)
  quantity: number;
  @Column()
  price: number;
  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'SET NULL',
  })
  recipes: Recipe[];
  @ManyToOne(() => Point, (point) => point.ingredients, {
    onDelete: 'SET NULL',
  })
  point: Point;
}
