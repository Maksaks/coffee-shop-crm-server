import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { PositionDiscount } from './entities/position-discount.entity';
import { PositionDiscountService } from './position-discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([PositionDiscount, MenuPosition])],
  providers: [PositionDiscountService],
  exports: [PositionDiscountService, TypeOrmModule],
})
export class DiscountModule {}
