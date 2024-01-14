import { IsNotEmpty } from 'class-validator';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';

export class CreateDiscountDto {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  endAt: Date;
  @IsNotEmpty()
  menuPosition: MenuPosition;
}
