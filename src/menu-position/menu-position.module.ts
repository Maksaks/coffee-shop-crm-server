import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from 'src/points/entities/points.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { MenuPosition } from './entities/menu-position.entity';
import { MenuPositionService } from './menu-position.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuPosition, Recipe, Point])],
  providers: [MenuPositionService],
  exports: [MenuPositionService, TypeOrmModule],
})
export class MenuPositionModule {}
