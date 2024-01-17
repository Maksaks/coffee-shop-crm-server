import { IsNotEmpty, IsOptional } from 'class-validator';
import { Admin } from 'src/admin/entities/admin.entity';
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
  pointMoney?: number;
  @IsOptional()
  barista?: Barista[];
  @IsNotEmpty()
  admin: Admin;
}
