import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BaristaModule } from './barista/barista.module';
import { IngredientsService } from './ingredients/ingredients.service';
import { MenuPositionService } from './menu-position/menu-position.service';
import { OrdersService } from './orders/orders.service';
import { PointsService } from './points/points.service';
import { PositionDiscountService } from './position-discount/position-discount.service';
import { RecipeService } from './recipe/recipe.service';
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
