import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Admin } from 'src/admin/entities/admin.entity';
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
  @MinLength(8)
  password: string;
  @IsNotEmpty()
  fixedHourRate: number;
  @IsNotEmpty()
  percentFromEarnings: number;
  @IsOptional()
  points?: Point[];
  @IsNotEmpty()
  admin: Admin;
}
