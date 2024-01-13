import { Module } from '@nestjs/common';
import { BaristaService } from './barista.service';
import { BaristaController } from './barista.controller';

@Module({
  controllers: [BaristaController],
  providers: [BaristaService],
})
export class BaristaModule {}
