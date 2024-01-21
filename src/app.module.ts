import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BaristaModule } from './barista/barista.module';
import { CategoriesModule } from './categories/categories.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { IngredientsService } from './ingredients/ingredients.service';
import { MenuPositionModule } from './menu-position/menu-position.module';
import { MenuPositionService } from './menu-position/menu-position.service';
import { OrderPositionModule } from './order-position/order-position.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersService } from './orders/orders.service';
import { PointModule } from './points/points.module';
import { PointsService } from './points/points.service';
import { DiscountModule } from './position-discount/discount.module';
import { PositionDiscountService } from './position-discount/position-discount.service';
import { RecipesModule } from './recipe/recipe.module';
import { RecipeService } from './recipe/recipe.service';
import { ShiftsModule } from './shifts/shifts.module';
import { ShiftsService } from './shifts/shifts.service';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    BaristaModule,
    AdminModule,
    AuthModule,
    StatisticsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServices: ConfigService) => ({
        type: 'postgres',
        host: configServices.get('DATABASE_HOST'),
        port: configServices.get('DATABASE_PORT'),
        username: configServices.get('DATABASE_USERNAME'),
        password: configServices.get('DATABASE_PASSWORD'),
        database: configServices.get('DATABASE_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }),
      inject: [ConfigService],
    }),
    MenuPositionModule,
    DiscountModule,
    CategoriesModule,
    IngredientsModule,
    OrdersModule,
    OrderPositionModule,
    PointModule,
    RecipesModule,
    ShiftsModule,
  ],
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
