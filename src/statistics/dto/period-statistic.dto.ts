import { IsNotEmpty } from 'class-validator';

export class PeriodForStatistic {
  @IsNotEmpty()
  from: Date;
  @IsNotEmpty()
  to: Date;
}
