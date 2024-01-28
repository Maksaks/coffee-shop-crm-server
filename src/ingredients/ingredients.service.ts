import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'src/points/entities/points.entity';
import { Shift, ShiftStatus } from 'src/shifts/entities/shift.entity';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}
  async create(
    createIngredientDro: CreateIngredientDto,
    pointID: number,
    adminID: number,
  ) {
    const existedPoint = await this.pointRepository.findOne({
      where: {
        id: pointID,
        admin: { id: adminID },
      },
    });
    if (!existedPoint) {
      return new BadRequestException(`Any point #${[pointID]} has not existed`);
    }
    const existedIngredient = await this.ingredientRepository.findOne({
      where: {
        name: createIngredientDro.name,
        point: { id: pointID },
      },
    });
    if (existedIngredient) {
      throw new BadRequestException(
        `Ingredient with name [${createIngredientDro.name}] has already existed on Point with #${pointID}`,
      );
    }
    return await this.ingredientRepository.save({
      ...createIngredientDro,
      point: { id: pointID },
    });
  }
  async findAll(adminID: number) {
    return await this.ingredientRepository.find({
      where: { point: { admin: { id: adminID } } },
      relations: { point: true },
    });
  }
  async findAllOnPoint(pointID: number, adminID: number) {
    const existedIngredient = await this.ingredientRepository.find({
      where: { point: { id: pointID, admin: { id: adminID } } },
    });
    if (!existedIngredient.length) {
      throw new BadRequestException(`No ingredients on Point #${pointID}`);
    }
    return existedIngredient;
  }

  async findAllOnPointForBarista(baristaID: number, adminID: number) {
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
      throw new BadRequestException(`No ingredients on this Point`);
    const existedIngredient = await this.ingredientRepository.find({
      where: {
        point: {
          id: lastShiftPointID,
          barista: { id: baristaID },
          admin: { id: adminID },
        },
      },
      order: {
        quantity: 'ASC',
      },
    });
    if (!existedIngredient.length) {
      throw new BadRequestException(`No ingredients on this Point`);
    }
    return existedIngredient;
  }

  async findOneByID(id: number, adminID: number) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: {
        id,
        point: { admin: { id: adminID } },
      },
      relations: { recipes: true, point: true },
    });
    if (!existedIngredient) {
      throw new BadRequestException(`Ingredient with #${id} was not found`);
    }
    return existedIngredient;
  }
  async findOneByName(name: string, adminID: number) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { name, point: { admin: { id: adminID } } },
      relations: { recipes: true, point: true },
    });
    if (!existedIngredient) {
      throw new BadRequestException(
        `Ingredients with name "${name}" was not found`,
      );
    }
    return existedIngredient;
  }
  async update(
    id: number,
    adminID: number,
    updateIngredientDto: UpdateIngredientDto,
  ) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { id, point: { admin: { id: adminID } } },
    });
    if (!existedIngredient) {
      throw new BadRequestException(`Ingredient with #${id} was not found`);
    }
    return await this.ingredientRepository.update(id, updateIngredientDto);
  }

  async remove(id: number, adminID: number) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { id, point: { admin: { id: adminID } } },
    });
    if (!existedIngredient) {
      throw new BadRequestException(`Ingredient with #${id} was not found`);
    }
    existedIngredient.recipes = [];
    await this.ingredientRepository.save(existedIngredient);
    return await this.ingredientRepository.delete(id);
  }

  async addQuantityOfIngredientsOnPoint(
    baristaID: number,
    ingredientID: number,
    adminID: number,
    addQuantityOfIngredient,
  ) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: {
        id: ingredientID,
        point: { barista: { id: baristaID, admin: { id: adminID } } },
      },
    });
    if (!existedIngredient) {
      throw new BadRequestException(
        `Ingredient with #${ingredientID} was not found`,
      );
    }
    existedIngredient.quantity += addQuantityOfIngredient;
    return await this.ingredientRepository.save(existedIngredient);
  }
}
