import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}
  async create(createIngredientDro: CreateIngredientDto, pointID: number) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { name: createIngredientDro.name, point: { id: pointID } },
    });
    if (existedIngredient) {
      return new BadRequestException(
        `Ingredient with name "${createIngredientDro.name}" has already existed on Point with #${pointID}`,
      );
    }
    return await this.ingredientRepository.save({
      ...createIngredientDro,
      point: { id: pointID },
    });
  }
  async findAll() {
    return await this.ingredientRepository.find({ relations: { point: true } });
  }
  async findAllOnPoint(pointID: number) {
    const existedIngredient = await this.ingredientRepository.find({
      where: { point: { id: pointID } },
    });
    if (existedIngredient.length) {
      return new BadRequestException(`No ingredients on Point #${pointID}`);
    }
    return await this.ingredientRepository.find({
      where: { point: { id: pointID } },
    });
  }
  async findOneByID(id: number) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { id },
    });
    if (!existedIngredient) {
      return new BadRequestException(`Ingredient with #${id} was not found`);
    }
    return await this.ingredientRepository.findOne({
      where: { id },
      relations: { recipes: true, point: true },
    });
  }
  async findOneByName(name: string) {
    const existedIngredient = await this.ingredientRepository.find({
      where: { name },
    });
    if (existedIngredient.length) {
      return new BadRequestException(
        `Ingredients with name "${name}" was not found`,
      );
    }
    return await this.ingredientRepository.find({
      where: { name },
      relations: { recipes: true, point: true },
    });
  }
  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { id },
    });
    if (!existedIngredient) {
      return new BadRequestException(`Ingredient with #${id} was not found`);
    }
    return await this.ingredientRepository.update(id, updateIngredientDto);
  }

  async remove(id: number) {
    const existedIngredient = await this.ingredientRepository.findOne({
      where: { id },
    });
    if (!existedIngredient) {
      return new BadRequestException(`Ingredient with #${id} was not found`);
    }
    return await this.ingredientRepository.delete(id);
  }
}
