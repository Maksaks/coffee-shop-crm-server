import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}
  async create(createRecipeDto: CreateRecipeDto) {
    const existedRecipeForPosition = await this.recipeRepository.findOne({
      where: { menuPosition: createRecipeDto.menuPosition },
    });
    if (existedRecipeForPosition) {
      return new BadRequestException(
        'Recipe for this position has already existed',
      );
    }
    return await this.recipeRepository.save(createRecipeDto);
  }
  async findAll() {
    return this.recipeRepository.find();
  }

  async findOne(id: number) {
    const existedRecipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (existedRecipe) {
      return new BadRequestException(`Recipe #${id} was not found`);
    }
    return await this.recipeRepository.findOne({
      where: { id },
      relations: { ingredients: true, menuPosition: true },
    });
  }
  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const existedRecipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (existedRecipe) {
      return new BadRequestException(`Recipe #${id} was not found`);
    }
    return await this.recipeRepository.update(id, updateRecipeDto);
  }

  async remove(id: number, adminID: number) {
    const existedRecipe = await this.recipeRepository.findOne({
      where: { id, menuPosition: { point: { admin: { id: adminID } } } },
    });
    if (existedRecipe) {
      return new BadRequestException(`Recipe #${id} was not found`);
    }
    existedRecipe.ingredients = [];
    return await this.recipeRepository.delete(id);
  }
}
