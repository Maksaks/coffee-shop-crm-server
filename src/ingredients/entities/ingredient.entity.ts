import { Min } from 'class-validator';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @ManyToMany()
  recipes: Recipe[];
}
