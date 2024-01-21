import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, OrderPosition])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
