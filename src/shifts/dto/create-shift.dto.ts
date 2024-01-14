import { IsNotEmpty } from 'class-validator';
import { Barista } from 'src/barista/entities/barista.entity';
import { ShiftStatus } from '../entities/shift.entity';

export class CreateShiftDto {
  @IsNotEmpty()
  status: ShiftStatus;
  @IsNotEmpty()
  barista: Barista;
}
