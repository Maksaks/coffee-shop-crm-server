import { IsNotEmpty } from 'class-validator';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';

export class CreateRecipeDto {
  @IsNotEmpty()
  stepsToReproduce: string[];
  @IsNotEmpty()
  menuPosition: MenuPosition;
  @IsNotEmpty()
  ingredients: Ingredient[];
}
