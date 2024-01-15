import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { MenuPosition } from './entities/menu-position.entity';
import { MenuPositionService } from './menu-position.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuPosition, Recipe])],
  providers: [MenuPositionService],
  exports: [MenuPositionService, TypeOrmModule],
})
export class MenuPositionModule {}
