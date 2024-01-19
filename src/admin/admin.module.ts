import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaristaModule } from 'src/barista/barista.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { PointModule } from 'src/points/points.module';
import { RecipesModule } from 'src/recipe/recipe.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    CategoriesModule,
    BaristaModule,
    PointModule,
    IngredientsModule,
    RecipesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
