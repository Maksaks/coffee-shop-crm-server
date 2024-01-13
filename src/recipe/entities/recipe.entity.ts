import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text', { array: true })
  stepsToReproduce: string[];
  @OneToOne()
  menuPosition: MenuPosition;
  @ManyToMany()
  ingredients: Ingredient[];
}
