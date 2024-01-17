import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
}
