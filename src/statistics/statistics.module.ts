import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barista } from 'src/barista/entities/barista.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Point } from 'src/points/entities/points.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      OrderPosition,
      MenuPosition,
      Point,
      Barista,
      Ingredient,
      Shift,
      Order,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
