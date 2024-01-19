import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Point } from 'src/points/entities/points.entity';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}
  // async create(
  //   createRecipeDto: CreateRecipeDto,
  //   pointID: number,
  //   adminID: number,
  // ) {
  //   const existedPosition = await this.menuPositionRepository.findOne({
  //     where: { id: createRecipeDto.menuPosition.id },
  //   });
  //   const existedRecipeForPosition = await this.recipeRepository.findOne({
  //     where: { menuPosition: { id: createRecipeDto.menuPosition.id } },
  //   });
  //   const existedPoint = await this.pointRepository.findOne({
  //     where: { admin: { id: adminID }, id: pointID },
  //     relations: { ingredients: true },
  //   });

  //   if (!existedPoint) {
  //     return new BadRequestException('Point was not existed');
  //   }
  //   if (!existedPosition) {
  //     return new BadRequestException('Position was not existed');
  //   }

  //   let isAllIngredientsSetOnPoint = true;

  //   for (const ingredient of createRecipeDto.ingredients) {
  //     if (!existedPoint.ingredients.find((item) => item.id === ingredient.id)) {
  //       isAllIngredientsSetOnPoint = false;
  //     }
  //   }

  //   if (!isAllIngredientsSetOnPoint) {
  //     return new BadRequestException(
  //       'Not all ingredients are existed on Point',
  //     );
  //   }
  //   if (existedRecipeForPosition) {
  //     return new BadRequestException(
  //       'Recipe for this position has already existed',
  //     );
  //   }

  //   const position = await this.menuPositionRepository.findOne({
  //     where: { id: createRecipeDto.menuPosition.id },
  //   });
  //   const recipe = await this.recipeRepository.save({
  //     ...createRecipeDto,
  //     menuPosition: position,
  //   });
  //   console.log(position);
  //   console.log(recipe);
  //   position.recipe.id = recipe.id;
  //   await this.menuPositionRepository.save(position);
  //   return recipe;
  // }

  // async findAll(pointID: number, adminID: number) {
  //   const existedRecipes = await this.recipeRepository.find({
  //     where: {
  //       menuPosition: { point: { admin: { id: adminID }, id: pointID } },
  //     },
  //     relations: { menuPosition: true, ingredients: true },
  //   });
  //   if (!existedRecipes.length) {
  //     return new BadRequestException(`Any recipe on this point was not found`);
  //   }
  //   return existedRecipes;
  // }

  // async findOne(id: number) {
  //   const existedRecipe = await this.recipeRepository.findOne({
  //     where: { id },
  //   });
  //   if (existedRecipe) {
  //     return new BadRequestException(`Recipe #${id} was not found`);
  //   }
  //   return await this.recipeRepository.findOne({
  //     where: { id },
  //     relations: { ingredients: true, menuPosition: true },
  //   });
  // }
  // async update(id: number, updateRecipeDto: UpdateRecipeDto, adminID: number) {
  //   const existedRecipe = await this.recipeRepository.findOne({
  //     where: { id, menuPosition: { point: { admin: { id: adminID } } } },
  //   });
  //   if (!existedRecipe) {
  //     return new BadRequestException(`Recipe #${id} was not found`);
  //   }
  //   return await this.recipeRepository.update(id, updateRecipeDto);
  // }

  // async remove(id: number, adminID: number) {
  //   const existedRecipe = await this.recipeRepository.findOne({
  //     where: { id, menuPosition: { point: { admin: { id: adminID } } } },
  //   });
  //   if (existedRecipe) {
  //     return new BadRequestException(`Recipe #${id} was not found`);
  //   }
  //   existedRecipe.ingredients = [];
  //   return await this.recipeRepository.delete(id);
  // }
}
