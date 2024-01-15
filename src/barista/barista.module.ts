import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from 'src/points/entities/points.entity';
import { BaristaController } from './barista.controller';
import { BaristaService } from './barista.service';
import { Barista } from './entities/barista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barista, Point])],
  controllers: [BaristaController],
  providers: [BaristaService],
})
export class BaristaModule {}
