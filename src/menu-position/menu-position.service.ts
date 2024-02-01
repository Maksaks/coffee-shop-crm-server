import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'src/points/entities/points.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Shift, ShiftStatus } from 'src/shifts/entities/shift.entity';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { MenuPosition } from './entities/menu-position.entity';

@Injectable()
export class MenuPositionService {
  constructor(
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}
  async create(
    menuPositionCreateDto: CreatePositionDto,
    pointID: number,
    adminID: number,
  ) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { name: menuPositionCreateDto.name, point: { id: pointID } },
    });
    if (existedPosition) {
      return new BadRequestException(
        `Menu-Position with name '${existedPosition.name}' has already existed`,
      );
    }
    const existedPoint = await this.pointRepository.findOne({
      where: {
        admin: { id: adminID },
        id: pointID,
      },
      relations: { ingredients: true },
    });
    if (!existedPoint) {
      throw new BadRequestException(`Point #${pointID} was not found`);
    }
    if (menuPositionCreateDto.ingredients) {
      for (const ingredient of menuPositionCreateDto.ingredients) {
        if (
          !existedPoint.ingredients.find((item) => item.id === ingredient.id)
        ) {
          throw new BadRequestException(
            'Not all ingredients are existed on Point',
          );
        }
      }
    }

    const recipe = await this.recipeRepository.save({
      ingredients:
        menuPositionCreateDto.ingredients &&
        menuPositionCreateDto.ingredients.length
          ? menuPositionCreateDto.ingredients.map((item) => {
              return { id: item.id };
            })
          : [],
      stepsToReproduce:
        menuPositionCreateDto.stepsToReproduce &&
        menuPositionCreateDto.stepsToReproduce.length
          ? menuPositionCreateDto.stepsToReproduce
          : [],
    });

    const newPosition = await this.menuPositionRepository.save({
      ...menuPositionCreateDto,
      point: { id: pointID },
      recipe: recipe,
    });
    await this.recipeRepository.save({ ...recipe, menuPosition: newPosition });
    return newPosition;
  }

  async getMenu(pointID: number, adminID: number) {
    let existedMenuPositions = await this.menuPositionRepository.find({
      where: { point: { id: pointID, admin: { id: adminID } } },
      relations: { category: true, recipe: true, discount: true },
    });
    if (!existedMenuPositions.length) {
      throw new BadRequestException(
        `Any menu position on this point was not found`,
      );
    }
    existedMenuPositions = existedMenuPositions.map((pos) => {
      if (pos.discount && pos.discount.endAt < new Date()) {
        pos.discount = null;
      }
      return pos;
    });
    return existedMenuPositions;
  }

  async getMenuByBaristaID(baristaID: number, adminID: number) {
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

    let existedMenuPositions = await this.menuPositionRepository.find({
      where: { point: { id: lastShiftPointID, admin: { id: adminID } } },
      relations: { category: true, recipe: true, discount: true },
    });
    if (!existedMenuPositions.length) {
      throw new BadRequestException(
        `Any menu position on this point was not found`,
      );
    }
    existedMenuPositions = existedMenuPositions.map((pos) => {
      if (pos.discount && pos.discount.endAt < new Date()) {
        pos.discount = null;
      }
      return pos;
    });
    return existedMenuPositions;
  }

  async findOne(id: number, pointID: number, adminID: number) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id, point: { id: pointID, admin: { id: adminID } } },
    });
    if (!existedPosition) {
      throw new BadRequestException(`Menu Position with #${id} was not found`);
    }
    return await this.menuPositionRepository.findOne({
      where: { id },
      relations: { category: true, recipe: true, discount: true },
    });
  }
  async update(
    id: number,
    pointID: number,
    adminID: number,
    updatedMenuPositionDto: UpdatePositionDto,
  ) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id, point: { id: pointID, admin: { id: adminID } } },
      relations: { recipe: true },
    });
    if (!existedPosition) {
      throw new BadRequestException(`Menu Position with #${id} was not found`);
    }
    if (
      !updatedMenuPositionDto.ingredients &&
      !updatedMenuPositionDto.stepsToReproduce
    ) {
      return await this.menuPositionRepository.update(
        id,
        updatedMenuPositionDto,
      );
    }
    const existedPoint = await this.pointRepository.findOne({
      where: { id: pointID },
      relations: { ingredients: true },
    });
    const recipe = await this.recipeRepository.findOne({
      where: { id: existedPosition.recipe.id },
      relations: { ingredients: true },
    });

    let ingredients;
    if (updatedMenuPositionDto.ingredients) {
      if (updatedMenuPositionDto.ingredients.length) {
        for (const ingredient of updatedMenuPositionDto.ingredients) {
          if (
            !existedPoint.ingredients.find((item) => item.id === ingredient.id)
          ) {
            throw new BadRequestException(
              'Not all ingredients are existed on Point',
            );
          }
        }
        ingredients = [...updatedMenuPositionDto.ingredients];
      } else {
        ingredients = [];
      }
    } else {
      ingredients = recipe.ingredients;
    }

    const updatedRecipe = {
      ...recipe,
      ingredients: ingredients,
      stepsToReproduce: updatedMenuPositionDto.stepsToReproduce
        ? !updatedMenuPositionDto.stepsToReproduce.length
          ? []
          : updatedMenuPositionDto.stepsToReproduce
        : recipe.stepsToReproduce,
    };
    await this.recipeRepository.save(updatedRecipe);
    return existedPosition;
  }
  async delete(id: number, pointID: number, adminID: number) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id, point: { id: pointID, admin: { id: adminID } } },
      relations: { recipe: true },
    });
    if (!existedPosition) {
      throw new BadRequestException(`Menu Position with #${id} was not found`);
    }
    const recipe = await this.recipeRepository.findOne({
      where: { id: existedPosition.recipe.id },
      relations: { ingredients: true },
    });
    recipe.ingredients = [];
    await this.recipeRepository.save(recipe);
    await this.recipeRepository.delete(recipe.id);
    return await this.menuPositionRepository.delete(id);
  }

  async getRecipe(id: number, pointID: number, adminID: number) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id, point: { id: pointID, admin: { id: adminID } } },
    });
    if (!existedPosition) {
      throw new BadRequestException(`Menu Position with #${id} was not found`);
    }
    return await this.recipeRepository.findOne({
      where: { menuPosition: { id } },
      relations: { ingredients: true, menuPosition: true },
    });
  }
}
