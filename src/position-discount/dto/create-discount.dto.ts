import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  endAt: Date;
}
