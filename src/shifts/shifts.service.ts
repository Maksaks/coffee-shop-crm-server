import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatesEnum } from 'src/enums/DatesEnum.enum';
import { getHourDifference } from 'src/helpers/GetHourDifference.helper';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { Shift, ShiftStatus } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    private readonly orderService: OrdersService,
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
      if (lastShift.length || lastShift[0].status === ShiftStatus.EndOfWork) {
        return await this.shiftRepository.save({
          ...createShiftDto,
          baristaSalary: 0,
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
      if (lastShift.length)
        return new BadRequestException(
          'You can`t end of shift until you start it',
        );
      if (lastShift[0].status === ShiftStatus.StartOfWork) {
        const lastDayOrders =
          (await this.orderService.findByBaristaIDAndForPeriod(
            id,
            DatesEnum.CurrentDay,
          )) as Order[];
        const baristaSalaryFromPercent = lastDayOrders.reduce((acc, cur) => {
          const salaryFromPercent =
            (cur.totalAmount * cur.barista.percentFromEarnings) / 100;
          return acc + salaryFromPercent;
        }, 0);
        const timeStartShift = lastShift[0].time;
        const timeEndShift = new Date();
        const totalBaristaSalary =
          baristaSalaryFromPercent +
          lastDayOrders[0].barista.fixedHourRate *
            getHourDifference(timeStartShift, timeEndShift);
        return await this.shiftRepository.save({
          ...createShiftDto,
          baristaSalary: totalBaristaSalary,
        });
      } else
        return new BadRequestException(
          'You can`t end of shift until you start it',
        );
    }
  }
  async getAllShiftsByBarista(id: number) {
    const shifts = await this.shiftRepository.find({
      where: { barista: { id } },
      relations: {
        point: true,
      },
    });
    if (shifts.length) {
      return new BadRequestException(
        `Shifts for Barista with #${id} weren\`t found`,
      );
    }
    return shifts;
  }
  async getAllShiftsByPoint(id: number) {
    const shifts = await this.shiftRepository.find({
      where: { point: { id } },
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

  async getAllShifts(adminID: number) {
    const shifts = await this.shiftRepository.find({
      where: { point: { admin: { id: adminID } } },
      relations: {
        barista: true,
        point: true,
      },
    });
    if (shifts.length) {
      return new BadRequestException(`Shifts were not found`);
    }
    return shifts;
  }

  async getCurrentStatus(baristaID: number) {
    const lastShift = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID },
      },
      order: { id: 'DESC' },
      take: 1,
    });
    if (lastShift.length || lastShift[0].status === ShiftStatus.EndOfWork) {
      return { status: ShiftStatus.EndOfWork };
    } else {
      return { status: ShiftStatus.StartOfWork };
    }
  }
}
