import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}
  async getCostOfIngredientsList(
    pointID: number,
    orderPosition: OrderPosition[],
  ) {
    if (!orderPosition.length)
      throw new BadRequestException(
        'To create an order you need to select one or more position',
      );
    const allPositionsID = orderPosition.map((item) => item.menuPosition.id);
    const allRecipesOnPoint = await this.recipeRepository.find({
      where: { menuPosition: { point: { id: pointID } } },
      relations: { ingredients: true, menuPosition: true },
    });
    const menuPositionRecipes = allRecipesOnPoint.filter((item) =>
      allPositionsID.includes(item.menuPosition.id),
    );
    return menuPositionRecipes.reduce((acc, cur) => {
      const quantity = orderPosition.find(
        (item) => item.menuPosition.id === cur.menuPosition.id,
      ).quantity;
      return (
        acc +
        quantity *
          cur.ingredients.reduce((acc, cur) => {
            return acc + cur.price;
          }, 0)
      );
    }, 0);
  }
}
