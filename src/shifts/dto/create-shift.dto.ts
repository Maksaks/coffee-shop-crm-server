import { IsNotEmpty } from 'class-validator';
import { ShiftStatus } from '../entities/shift.entity';

export class CreateShiftDto {
  @IsNotEmpty()
  status: ShiftStatus;
}
