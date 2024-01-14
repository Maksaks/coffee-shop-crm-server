import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionDiscount } from './entities/position-discount.entity';
import { PositionDiscountService } from './position-discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([PositionDiscount])],
  providers: [PositionDiscountService],
  exports: [PositionDiscountService, TypeOrmModule],
})
export class DiscountModule {}
