import { IsNotEmpty } from 'class-validator';

export class GetByNameIngredientDto {
  @IsNotEmpty()
  name: string;
}
