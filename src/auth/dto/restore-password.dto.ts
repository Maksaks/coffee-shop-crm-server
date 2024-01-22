import { IsNotEmpty } from 'class-validator';

export class RestorePasswordDto {
  @IsNotEmpty()
  email: string;
}
