import { IsNotEmpty, Min } from 'class-validator';

export class AddIngredientDto {
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
