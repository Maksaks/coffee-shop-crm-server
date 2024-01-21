import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { OrderPositionModule } from 'src/order-position/order-position.module';
import { PointModule } from 'src/points/points.module';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { RecipesModule } from 'src/recipe/recipe.module';
import { Shift } from 'src/shifts/entities/shift.entity';
import { Order } from './entities/orders.entity';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Shift, Recipe, MenuPosition]),
    OrderPositionModule,
    PointModule,
    RecipesModule,
  ],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
