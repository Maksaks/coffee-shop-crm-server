import { IsEmail, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Point } from 'src/points/entities/points.entity';

export class CreateBaristaDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  phoneNumber: string;
  @Min(8)
  password: string;
  @IsNotEmpty()
  fixedRate: number;
  @IsNotEmpty()
  percentFromEarnings: number;
  @IsOptional()
  points?: Point[];
}
