import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { Point } from 'src/points/entities/points.entity';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Point]), OrdersModule],
  providers: [ShiftsService],
  exports: [ShiftsService, TypeOrmModule],
})
export class ShiftsModule {}
