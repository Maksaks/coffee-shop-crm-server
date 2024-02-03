import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Shift, ShiftStatus } from 'src/shifts/entities/shift.entity';
import { Repository } from 'typeorm';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Point } from './entities/points.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}
  async create(adminID: number, createPointDto: CreatePointDto) {
    const existedPoint = await this.pointRepository.findOne({
      where: { name: createPointDto.name, admin: { id: adminID } },
    });
    if (existedPoint) {
      return new BadRequestException(
        `Point with name [${createPointDto.name}] has already existed`,
      );
    }
    return await this.pointRepository.save({
      ...createPointDto,
      admin: { id: adminID },
    });
  }

  async findPointsByBaristaID(baristaID: number, adminID: number) {
    const existedPoints = await this.pointRepository.find({
      where: { barista: { id: baristaID }, admin: { id: adminID } },
    });
    if (!existedPoints.length) {
      return new BadRequestException(
        `Points for Barista #${baristaID} were not found`,
      );
    }
    return existedPoints;
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

  async getOnlyPointsInfo(adminID: number) {
    const points = await this.pointRepository.find({
      where: { admin: { id: adminID } },
      relations: { barista: true, ingredients: true, menuPositions: true },
    });
    const outputPoints = [];
    for (const point of points) {
      const {
        id,
        name,
        address,
        description,
        workingHours,
        pointMoney,
        ...other
      } = point;
      outputPoints.push({
        id,
        name,
        address,
        description,
        workingHours,
        pointMoney,
        baristaCount: point.barista.length,
        ingredientsCount: point.ingredients.length,
        menuPositionsCount: point.menuPositions.length,
      });
    }
    return outputPoints;
  }

  async getPointsWithOrders(adminID: number) {
    return await this.pointRepository.find({
      where: { admin: { id: adminID } },
      relations: {
        orders: true,
      },
      select: { id: true, name: true, orders: true },
    });
  }

  async getPointsWithIngredients(adminID: number) {
    return await this.pointRepository.find({
      where: { admin: { id: adminID } },
      relations: {
        orders: true,
      },
      select: { id: true, name: true, ingredients: true },
    });
  }

  async findAllForPositions(adminID: number) {
    return await this.pointRepository.find({
      where: { admin: { id: adminID } },
      relations: {
        ingredients: true,
        menuPositions: true,
      },
    });
  }

  async findOne(id: number, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      throw new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.findOne({
      where: { id },
      relations: {
        barista: true,
        ingredients: true,
        orders: true,
        shifts: true,
        menuPositions: true,
      },
    });
  }

  async findByBaristaAndPoint(baristaID: number, adminID: number) {
    let lastShiftPointID: number;
    const lastShift = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID },
        point: { admin: { id: adminID } },
      },
      relations: { point: true },
      order: { id: 'DESC' },
      take: 1,
    });
    if (lastShift[0].status.toString() === ShiftStatus.StartOfWork.toString()) {
      lastShiftPointID = lastShift[0].point.id;
    }
    if (!lastShiftPointID)
      throw new BadRequestException(`No menu positions on this Point`);
    const existedPoint = await this.pointRepository.findOne({
      where: {
        id: lastShiftPointID,
        barista: { id: baristaID },
        admin: { id: adminID },
      },
    });
    if (!existedPoint) {
      throw new BadRequestException(`Point #${lastShiftPointID} was not found`);
    }
    return existedPoint;
  }

  async update(id: number, updatePointDto: UpdatePointDto, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      throw new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.update(id, updatePointDto);
  }

  async remove(id: number, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      throw new BadRequestException(`Point #${id} was not found`);
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
      throw new BadRequestException(`Point #${pointId} was not found`);
    }
    if (amount < 0) {
      amount = amount * -1;
    }
    if (existedPoint.pointMoney < amount) {
      throw new BadRequestException(`Not enough cash at the point`);
    }
    existedPoint.pointMoney = existedPoint.pointMoney - amount;
    return await this.pointRepository.save(existedPoint);
  }
  async putMoneyOnBalance(pointId: number, baristaId: number, amount: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id: pointId, barista: { id: baristaId } },
    });
    if (!existedPoint) {
      throw new BadRequestException(`Point #${pointId} was not found`);
    }
    if (amount < 0) {
      amount = amount * -1;
    }

    existedPoint.pointMoney = existedPoint.pointMoney + amount;
    return await this.pointRepository.save(existedPoint);
  }

  async updateIngredientsOnPoint(pointID: number, positions: OrderPosition[]) {
    let existedPointIngredients = await this.ingredientRepository.find({
      where: { point: { id: pointID } },
    });
    if (!existedPointIngredients) {
      throw new BadRequestException(
        `Ingredients on point #${pointID} was not found`,
      );
    }
    const allPositionsID = positions.map((item) => item.menuPosition.id);
    const allRecipesOnPoint = await this.recipeRepository.find({
      where: { menuPosition: { point: { id: pointID } } },
      relations: { ingredients: true, menuPosition: true },
    });
    const menuPositionRecipes = allRecipesOnPoint.filter((item) =>
      allPositionsID.includes(item.menuPosition.id),
    );
    for (const recipe of menuPositionRecipes) {
      const ingredientsID = recipe.ingredients.map((item) => item.id);
      existedPointIngredients = existedPointIngredients.map((item) => {
        if (ingredientsID.includes(item.id)) {
          if (item.quantity <= 0) {
            throw new BadRequestException(
              `Point #${pointID} has not got enough ingredients`,
            );
          }
          item.quantity -= positions.find(
            (item) => item.menuPosition.id === recipe.menuPosition.id,
          ).quantity;
          return item;
        } else return item;
      });
    }
    return await this.ingredientRepository.save(existedPointIngredients);
  }
}
