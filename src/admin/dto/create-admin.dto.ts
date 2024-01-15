import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsEmail()
  email: string;
  @Min(12)
  password: string;
}
