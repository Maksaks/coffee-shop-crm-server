import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddIngredientDto } from 'src/ingredients/dto/add-ingredient.dto';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { ShiftStatus } from 'src/shifts/entities/shift.entity';
import { ShiftsService } from 'src/shifts/shifts.service';
import { BaristaService } from './barista.service';

@Controller('barista')
export class BaristaController {
  constructor(
    private readonly baristaService: BaristaService,
    private readonly orderService: OrdersService,
    private readonly shiftService: ShiftsService,
    private readonly ingredientService: IngredientsService,
  ) {}
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get('orders/:orderID/ready')
  @UseGuards(JwtAuthGuard)
  completeOrder(@Param('orderID') orderID: number, @Request() req) {
    return this.orderService.completeOrder(orderID, req.user.id);
  }

  @Get('shift/start/:pointID')
  @UseGuards(JwtAuthGuard)
  startShift(@Param('pointID') pointID: number, @Request() req) {
    return this.shiftService.create(
      ShiftStatus.StartOfWork,
      pointID,
      req.user.id,
      req.user.admin.id,
    );
  }

  @Get('shift/end/:pointID')
  @UseGuards(JwtAuthGuard)
  endShift(@Param('pointID') pointID: number, @Request() req) {
    return this.shiftService.create(
      ShiftStatus.EndOfWork,
      pointID,
      req.user.id,
      req.user.admin.id,
    );
  }

  @Post('ingredients/:ingredientID/onPoint/:pointID')
  @UseGuards(JwtAuthGuard)
  @UsePipes()
  addIngredientsOnPoint(
    @Body() addIngredientDto: AddIngredientDto,
    @Param('ingredientID') ingredientID: number,
    @Param('pointID') pointID: number,
    @Request() req,
  ) {
    return this.ingredientService.addQuantityOfIngredientsOnPoint(
      req.user.id,
      ingredientID,
      req.user.admin.id,
      addIngredientDto.quantity,
    );
  }
}
