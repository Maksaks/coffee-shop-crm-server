import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionDiscount } from './entities/position-discount.entity';

@Injectable()
export class PositionDiscountService {
  constructor(
    @InjectRepository(PositionDiscount)
    private readonly discountRepository: Repository<PositionDiscount>,
  ) {}
}
