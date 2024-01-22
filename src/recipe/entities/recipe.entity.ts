import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  @OneToOne(() => MenuPosition, (position) => position.recipe, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id' })
  menuPosition: MenuPosition;
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes, {
    onDelete: 'SET NULL',
    eager: true,
  })
  ingredients: Ingredient[];
}
