import { IsNotEmpty } from 'class-validator';
import { Point } from 'src/points/entities/points.entity';
import { ShiftStatus } from '../entities/shift.entity';

export class CreateShiftDto {
  @IsNotEmpty()
  status: ShiftStatus;
  @IsNotEmpty()
  point: Point;
}
