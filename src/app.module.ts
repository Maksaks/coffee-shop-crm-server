import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BaristaModule } from './barista/barista.module';
import { MenuPositionService } from './menu-position/menu-position.service';
import { PositionDiscountService } from './position-discount/position-discount.service';
import { RecipeService } from './recipe/recipe.service';
import { StatisticsModule } from './statistics/statistics.module';
import { IngredientsService } from './ingredients/ingredients.service';
import { OrdersService } from './orders/orders.service';
import { PointsService } from './points/points.service';
import { ShiftsService } from './shifts/shifts.service';

@Module({
  imports: [BaristaModule, AdminModule, AuthModule, StatisticsModule],
  controllers: [AppController],
  providers: [
    AppService,
    MenuPositionService,
    PositionDiscountService,
    RecipeService,
    IngredientsService,
    OrdersService,
    PointsService,
    ShiftsService,
  ],
})
export class AppModule {}
