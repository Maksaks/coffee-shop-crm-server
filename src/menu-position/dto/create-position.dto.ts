import { IsNotEmpty, IsOptional } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class CreatePositionDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  price: number;
  @IsOptional()
  category?: Category;
}
