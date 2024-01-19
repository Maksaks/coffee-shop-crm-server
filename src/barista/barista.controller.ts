import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { BaristaService } from './barista.service';

@Controller('barista')
export class BaristaController {
  constructor(
    private readonly baristaService: BaristaService,
    private readonly orderService: OrdersService,
  ) {}
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
}
