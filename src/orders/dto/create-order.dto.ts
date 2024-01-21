import { IsNotEmpty } from 'class-validator';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Point } from 'src/points/entities/points.entity';
import { PaymentMethod } from '../entities/orders.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
  @IsNotEmpty()
  receivedAmount: number;
  @IsNotEmpty()
  totalAmount: number;
  @IsNotEmpty()
  point: Point;
  @IsNotEmpty()
  orderList: OrderPosition[];
}
