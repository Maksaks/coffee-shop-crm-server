import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PositionDiscount } from './entities/position-discount.entity';

@Injectable()
export class PositionDiscountService {
  constructor(
    @InjectRepository(PositionDiscount)
    private readonly discountRepository: Repository<PositionDiscount>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
  ) {}
  async create(
    createDiscountDto: CreateDiscountDto,
    positionID: number,
    adminID: number,
  ) {
    const existedMenuPosition = await this.menuPositionRepository.findOne({
      where: { id: positionID, point: { admin: { id: adminID } } },
    });
    if (!existedMenuPosition) {
      return new BadRequestException(`Position #${positionID} was not found`);
    }
    let existedDiscountForPosition = await this.discountRepository.findOne({
      where: { menuPosition: { id: positionID } },
      relations: { menuPosition: true },
    });
    if (
      existedDiscountForPosition &&
      existedDiscountForPosition.endAt < new Date()
    ) {
      await this.discountRepository.delete(existedDiscountForPosition.id);
      existedDiscountForPosition = undefined;
    }
    if (existedDiscountForPosition) {
      return new BadRequestException(
        'Discount for this MenuPosition has already existed',
      );
    }
    const newDiscount = await this.discountRepository.save({
      ...createDiscountDto,
      menuPosition: existedMenuPosition,
    });
    console.log(newDiscount);
    await this.menuPositionRepository.save({
      ...existedMenuPosition,
      discount: newDiscount,
    });
    return newDiscount;
  }

  async findAll(adminID: number) {
    return await this.discountRepository.find({
      where: {
        menuPosition: { point: { admin: { id: adminID } } },
      },
      relations: {
        menuPosition: true,
      },
    });
  }
  async findDiscountByPointID(pointID: number, adminID: number) {
    let existedDiscountsForPoint = await this.discountRepository.find({
      where: {
        menuPosition: { point: { id: pointID, admin: { id: adminID } } },
      },
      relations: { menuPosition: true },
    });
    const discountOnRemoving = existedDiscountsForPoint.filter(
      (item) => item.endAt < new Date(),
    );
    await this.discountRepository.remove(discountOnRemoving);
    existedDiscountsForPoint = existedDiscountsForPoint.filter(
      (item) => item.endAt > new Date(),
    );
    if (!existedDiscountsForPoint.length) {
      return new BadRequestException('Discounts for this point were not found');
    }

    return existedDiscountsForPoint;
  }

  async update(
    positionID: number,
    updateDiscountDto: UpdateDiscountDto,
    adminID: number,
  ) {
    const existedDiscount = await this.discountRepository.findOne({
      where: {
        menuPosition: { id: positionID, point: { admin: { id: adminID } } },
      },
    });
    if (!existedDiscount) {
      return new BadRequestException(
        `Discount for position#${positionID} was not found`,
      );
    }
    return await this.discountRepository.update(
      existedDiscount.id,
      updateDiscountDto,
    );
  }

  async remove(positionId: number, adminID: number) {
    const existedDiscount = await this.discountRepository.findOne({
      where: {
        menuPosition: { id: positionId, point: { admin: { id: adminID } } },
      },
    });
    if (!existedDiscount) {
      return new BadRequestException(
        `Discount for position #${positionId} was not found`,
      );
    }
    return await this.discountRepository.delete(existedDiscount.id);
  }
}
