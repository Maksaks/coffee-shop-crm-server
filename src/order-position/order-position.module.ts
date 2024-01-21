import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { OrderPosition } from './entities/order-position.entity';
import { OrderPositionService } from './order-position.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderPosition, MenuPosition])],
  providers: [OrderPositionService],
  exports: [TypeOrmModule, OrderPositionService],
})
export class OrderPositionModule {}
