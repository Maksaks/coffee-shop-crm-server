import { IsNotEmpty, IsOptional } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';

export class CreatePositionDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  price: number;
  @IsOptional()
  category?: Category;
  @IsOptional()
  ingredients?: Ingredient[];
  @IsOptional()
  stepsToReproduce?: string[];
}
