import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  providers: [RecipeService],
  exports: [RecipeService, TypeOrmModule],
})
export class RecipesModule {}
