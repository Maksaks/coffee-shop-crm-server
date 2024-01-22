import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsEmail()
  email: string;
  @MinLength(12)
  password: string;
  @IsOptional()
  isEmailConfirmed?: boolean;
}
