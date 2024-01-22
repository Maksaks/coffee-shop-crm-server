import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaristaModule } from 'src/barista/barista.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { MailerSenderModule } from 'src/mailer/mailer.module';
import { MenuPositionModule } from 'src/menu-position/menu-position.module';
import { OrderPositionModule } from 'src/order-position/order-position.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PointModule } from 'src/points/points.module';
import { DiscountModule } from 'src/position-discount/discount.module';
import { RecipesModule } from 'src/recipe/recipe.module';
import { ShiftsModule } from 'src/shifts/shifts.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    CategoriesModule,
    BaristaModule,
    PointModule,
    IngredientsModule,
    RecipesModule,
    MenuPositionModule,
    ShiftsModule,
    DiscountModule,
    OrdersModule,
    OrderPositionModule,
    MailerSenderModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
