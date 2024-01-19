import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Repository } from 'typeorm';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Point } from './entities/points.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}
  async create(adminID: number, createPointDto: CreatePointDto) {
    const existedPoint = await this.pointRepository.findOne({
      where: { name: createPointDto.name, admin: { id: adminID } },
    });
    if (existedPoint) {
      return new BadRequestException(
        `Point with name ${createPointDto.name} has already existed`,
      );
    }
    return await this.pointRepository.save({
      ...createPointDto,
      admin: { id: adminID },
    });
  }

  async findPointsByBaristaID(baristaID: number, adminID: number) {
    const existedPoint = await this.pointRepository.find({
      where: { barista: { id: baristaID }, admin: { id: adminID } },
    });
    if (!existedPoint.length) {
      return new BadRequestException(
        `Points for Barista #${baristaID} were not found`,
      );
    }
    return await this.pointRepository.find({
      where: { barista: { id: baristaID } },
    });
  }

  async findAll(adminID: number) {
    return await this.pointRepository.find({
      where: { admin: { id: adminID } },
      relations: {
        barista: true,
        ingredients: true,
        orders: true,
        shifts: true,
        menuPositions: true,
      },
    });
  }

  async findOne(id: number, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.findOne({
      where: { id },
      relations: {
        barista: true,
        ingredients: true,
        orders: true,
        shifts: true,
      },
    });
  }
  async update(id: number, updatePointDto: UpdatePointDto, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.update(id, updatePointDto);
  }

  async remove(id: number, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${id} was not found`);
    }
    existedPoint.barista = [];
    await this.pointRepository.save(existedPoint);
    return await this.pointRepository.delete(id);
  }

  async getMoneyFromBalance(
    pointId: number,
    baristaId: number,
    amount: number,
  ) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id: pointId, barista: { id: baristaId } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${pointId} was not found`);
    }
    if (amount < 0) {
      amount = amount * -1;
    }
    if (existedPoint.pointMoney < amount) {
      return new BadRequestException(`Not enough cash at the point`);
    }
    existedPoint.pointMoney = existedPoint.pointMoney - amount;
    return await this.pointRepository.save(existedPoint);
  }
  async putMoneyOnBalance(pointId: number, baristaId: number, amount: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id: pointId, barista: { id: baristaId } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${pointId} was not found`);
    }
    if (amount < 0) {
      amount = amount * -1;
    }

    existedPoint.pointMoney = existedPoint.pointMoney + amount;
    return await this.pointRepository.save(existedPoint);
  }

  async updateIngredientsOnPoint(pointID: number, positions: MenuPosition[]) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id: pointID },
      relations: { ingredients: true },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${pointID} was not found`);
    }
    for (const position of positions) {
      const ingredients = position.recipe.ingredients;
      for (const ingredient of ingredients) {
        const indexOfIngredient = existedPoint.ingredients.indexOf(ingredient);
        existedPoint.ingredients[indexOfIngredient].quantity -= 1;
      }
    }
    this.pointRepository.save(existedPoint);
  }
}
