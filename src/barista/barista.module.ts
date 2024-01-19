import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { Point } from 'src/points/entities/points.entity';
import { BaristaController } from './barista.controller';
import { BaristaService } from './barista.service';
import { Barista } from './entities/barista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barista, Point]), OrdersModule],
  controllers: [BaristaController],
  providers: [BaristaService],
  exports: [BaristaService],
})
export class BaristaModule {}
