import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPosition } from './entities/menu-position.entity';
import { MenuPositionService } from './menu-position.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuPosition])],
  providers: [MenuPositionService],
  exports: [MenuPositionService, TypeOrmModule],
})
export class MenuPositionModule {}
