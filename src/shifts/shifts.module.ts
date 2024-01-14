import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift])],
  providers: [ShiftsService],
  exports: [ShiftsService, TypeOrmModule],
})
export class ShiftsModule {}
