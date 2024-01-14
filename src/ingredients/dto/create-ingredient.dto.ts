import { IsNotEmpty, Min } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @Min(0)
  quantity: number;
  @IsNotEmpty()
  price: number;
}
