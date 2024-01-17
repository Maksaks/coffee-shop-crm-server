import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePointDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  workingHours: string;
  @IsOptional()
  pointMoney?: number;
}
