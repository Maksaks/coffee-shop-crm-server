import { IsNotEmpty } from 'class-validator';

export class GetOrderForPeriodDto {
  @IsNotEmpty()
  from: Date;
  @IsNotEmpty()
  to: Date;
}
