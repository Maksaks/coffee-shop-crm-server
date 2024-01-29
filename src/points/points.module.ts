import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { Point } from './entities/points.entity';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([Point, Recipe, Ingredient, Shift])],
  providers: [PointsService],
  exports: [PointsService, TypeOrmModule],
})
export class PointModule {}
