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
import { RolesGuard } from 'src/auth/guards/role.guards';
import { AllowedRoles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enums/roles.enum';
import { AddIngredientDto } from 'src/ingredients/dto/add-ingredient.dto';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersService } from 'src/orders/orders.service';
import { TakeMoneyDto } from 'src/points/dto/take-money.dto';
import { PointsService } from 'src/points/points.service';
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
    private readonly pointService: PointsService,
  ) {}
  @Post('orders')
  @AllowedRoles(Roles.Barista)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get('orders/:orderID/ready')
  @AllowedRoles(Roles.Barista)
  @UseGuards(JwtAuthGuard, RolesGuard)
  completeOrder(@Param('orderID') orderID: number, @Request() req) {
    return this.orderService.completeOrder(orderID, req.user.id);
  }

  @Get('shift/start/:pointID')
  @AllowedRoles(Roles.Barista)
  @UseGuards(JwtAuthGuard, RolesGuard)
  startShift(@Param('pointID') pointID: number, @Request() req) {
    return this.shiftService.create(
      ShiftStatus.StartOfWork,
      pointID,
      req.user.id,
      req.user.admin.id,
    );
  }

  @Get('shift/end/:pointID')
  @AllowedRoles(Roles.Barista)
  @UseGuards(JwtAuthGuard, RolesGuard)
  endShift(@Param('pointID') pointID: number, @Request() req) {
    return this.shiftService.create(
      ShiftStatus.EndOfWork,
      pointID,
      req.user.id,
      req.user.admin.id,
    );
  }

  @Post('ingredients/:ingredientID/onPoint/:pointID')
  @AllowedRoles(Roles.Barista)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get('points/:pointID/takeMoney')
  @UsePipes(new ValidationPipe())
  @AllowedRoles(Roles.Barista)
  @UseGuards(JwtAuthGuard, RolesGuard)
  takeMoneyFromPointBalance(
    @Param('pointID') pointID: number,
    @Request() req,
    @Body() takeMoneyDto: TakeMoneyDto,
  ) {
    return this.pointService.getMoneyFromBalance(
      pointID,
      req.user.id,
      takeMoneyDto.amount,
    );
  }
}
