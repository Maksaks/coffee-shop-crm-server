import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { Shift, ShiftStatus } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}
  async create(createShiftDto: CreateShiftDto, id: number) {
    if (createShiftDto.status === ShiftStatus.StartOfWork) {
      const lastShift = await this.shiftRepository.find({
        where: {
          barista: { id },
        },
        order: { id: 'DESC' },
        take: 1,
      });
      if (lastShift[0].status === ShiftStatus.EndOfWork) {
        return await this.shiftRepository.save({
          status: ShiftStatus.StartOfWork,
          barista: { id },
        });
      } else return new BadRequestException('Last shift hasn`t been ended');
    } else if (createShiftDto.status === ShiftStatus.EndOfWork) {
      const lastShift = await this.shiftRepository.find({
        where: {
          barista: { id },
        },
        order: { id: 'DESC' },
        take: 1,
      });
      if (lastShift[0].status === ShiftStatus.StartOfWork) {
        return await this.shiftRepository.save({
          status: ShiftStatus.EndOfWork,
          barista: { id },
        });
      } else
        return new BadRequestException(
          'You can`t end of shift until you start it',
        );
    }
  }
  async getAllShiftsForBarista(id: number) {
    const shifts = await this.shiftRepository.find({
      where: { barista: { id } },
      relations: {
        barista: true,
      },
    });
    if (shifts.length) {
      return new BadRequestException(
        `Shifts for Barista with #${id} weren\`t found`,
      );
    }
    return shifts;
  }
}
