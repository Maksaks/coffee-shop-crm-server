import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/points.entity';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  providers: [PointsService],
  exports: [PointsService, TypeOrmModule],
})
export class PointModule {}
