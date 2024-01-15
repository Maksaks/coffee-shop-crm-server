import { IsNotEmpty } from 'class-validator';
import { Barista } from 'src/barista/entities/barista.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Point } from 'src/points/entities/points.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  totalAmount: number;
  @IsNotEmpty()
  barista: Barista;
  @IsNotEmpty()
  point: Point;
  @IsNotEmpty()
  menuPositions: MenuPosition[];
}
