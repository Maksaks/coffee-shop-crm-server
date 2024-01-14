import { IsNotEmpty, IsOptional } from 'class-validator';
import { Barista } from 'src/barista/entities/barista.entity';

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
  barista?: Barista[];
}
