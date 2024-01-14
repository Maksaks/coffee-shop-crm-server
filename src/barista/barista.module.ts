import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaristaController } from './barista.controller';
import { BaristaService } from './barista.service';
import { Barista } from './entities/barista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barista])],
  controllers: [BaristaController],
  providers: [BaristaService],
})
export class BaristaModule {}
