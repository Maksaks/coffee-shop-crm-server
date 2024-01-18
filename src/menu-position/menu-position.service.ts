import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from 'src/recipe/entities/recipe.entity';
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
  ) {}
  async create(menuPositionCreateDto: CreatePositionDto) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { name: menuPositionCreateDto.name },
    });
    if (existedPosition) {
      return new BadRequestException(
        `Menu Position with name '${existedPosition.name}' has already existed`,
      );
    }
    const newCategory = {
      ...menuPositionCreateDto,
    };
    return await this.menuPositionRepository.save(newCategory);
  }
  async getMenu(pointID: number) {
    return await this.menuPositionRepository.find({
      where: { point: { id: pointID } },
      relations: { category: true, recipe: true, discount: true },
    });
  }
  async findOne(id: number) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id },
    });
    if (!existedPosition) {
      return new BadRequestException(`Menu Position with #${id} was not found`);
    }
    return await this.menuPositionRepository.findOne({
      where: { id },
      relations: { category: true, recipe: true, discount: true },
    });
  }
  async update(id: number, updatedMenuPositionDto: UpdatePositionDto) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id },
    });
    if (!existedPosition) {
      return new BadRequestException(`Menu Position with #${id} was not found`);
    }
    return await this.menuPositionRepository.update(id, updatedMenuPositionDto);
  }
  async delete(id: number) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id },
    });
    if (!existedPosition) {
      return new BadRequestException(`Menu Position with #${id} was not found`);
    }
    return await this.menuPositionRepository.delete(id);
  }

  async getRecipe(id: number) {
    const existedPosition = await this.menuPositionRepository.findOne({
      where: { id },
    });
    if (!existedPosition) {
      return new BadRequestException(`Menu Position with #${id} was not found`);
    }
    return await this.recipeRepository.findOne({
      where: { menuPosition: { id } },
    });
  }
}
