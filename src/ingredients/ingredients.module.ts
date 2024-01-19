import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from 'src/points/entities/points.entity';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, Point])],
  providers: [IngredientsService],
  exports: [IngredientsService, TypeOrmModule],
})
export class IngredientsModule {}
