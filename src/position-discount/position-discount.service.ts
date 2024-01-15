import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PositionDiscount } from './entities/position-discount.entity';

@Injectable()
export class PositionDiscountService {
  constructor(
    @InjectRepository(PositionDiscount)
    private readonly discountRepository: Repository<PositionDiscount>,
  ) {}
  async create(createDiscountDto: CreateDiscountDto) {
    const existedDiscountForPosition = await this.discountRepository.findOne({
      where: { menuPosition: createDiscountDto.menuPosition },
    });
    if (existedDiscountForPosition) {
      return new BadRequestException(
        'Discount for this MenuPosition has already existed',
      );
    }
    return await this.discountRepository.save({ ...createDiscountDto });
  }

  async findAll() {
    return await this.discountRepository.find();
  }
  async findDiscountByPositionID(positionID: number) {
    const existedDiscountForPosition = await this.discountRepository.findOne({
      where: { menuPosition: { id: positionID } },
    });
    if (!existedDiscountForPosition) {
      return new BadRequestException(
        'Discount for this MenuPosition was not found',
      );
    }
    return existedDiscountForPosition;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const existedDiscount = await this.discountRepository.findOne({
      where: { id },
    });
    if (!existedDiscount) {
      return new BadRequestException(`Discount #${id} was not found`);
    }
    return await this.discountRepository.update(id, updateDiscountDto);
  }

  async remove(id: number) {
    const existedDiscount = await this.discountRepository.findOne({
      where: { id },
    });
    if (!existedDiscount) {
      return new BadRequestException(`Discount #${id} was not found`);
    }
    return await this.discountRepository.delete(id);
  }
}
