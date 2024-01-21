import { IsNotEmpty } from 'class-validator';

export class TakeMoneyDto {
  @IsNotEmpty()
  amount: number;
}
