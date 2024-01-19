import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Point } from 'src/points/entities/points.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Point, MenuPosition])],
  providers: [RecipeService],
  exports: [RecipeService, TypeOrmModule],
})
export class RecipesModule {}
