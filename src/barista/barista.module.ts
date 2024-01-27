import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { MailerSenderModule } from 'src/mailer/mailer.module';
import { OrdersModule } from 'src/orders/orders.module';
import { Point } from 'src/points/entities/points.entity';
import { PointModule } from 'src/points/points.module';
import { Shift } from 'src/shifts/entities/shift.entity';
import { ShiftsModule } from 'src/shifts/shifts.module';
import { BaristaController } from './barista.controller';
import { BaristaService } from './barista.service';
import { Barista } from './entities/barista.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barista, Point, Shift, Admin]),
    OrdersModule,
    ShiftsModule,
    IngredientsModule,
    PointModule,
    MailerSenderModule,
  ],
  controllers: [BaristaController],
  providers: [BaristaService],
  exports: [BaristaService],
})
export class BaristaModule {}
