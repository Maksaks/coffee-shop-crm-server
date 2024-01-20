import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getHourDifference } from 'src/helpers/GetHourDifference.helper';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Between, Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { Shift, ShiftStatus } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    private readonly orderService: OrdersService,
  ) {}
  async create(
    createShiftDto: CreateShiftDto,
    baristaId: number,
    adminID: number,
  ) {
    if (createShiftDto.status === ShiftStatus.StartOfWork.toString()) {
      const lastShift = await this.shiftRepository.find({
        where: {
          barista: { id: baristaId },
          point: { admin: { id: adminID } },
        },
        order: { id: 'DESC' },
        take: 1,
      });
      if (
        !lastShift.length ||
        lastShift[0].status === ShiftStatus.EndOfWork.toString()
      ) {
        return await this.shiftRepository.save({
          ...createShiftDto,
          baristaSalary: 0,
          barista: { id: baristaId },
        });
      } else return new BadRequestException('Last shift hasn`t been ended');
    } else if (createShiftDto.status === ShiftStatus.EndOfWork.toString()) {
      const lastShift = await this.shiftRepository.find({
        where: {
          barista: { id: baristaId },
          point: { admin: { id: adminID } },
        },
        order: { id: 'DESC' },
        take: 1,
      });
      if (!lastShift.length)
        return new BadRequestException(
          'You can`t end of shift until you start it',
        );
      if (lastShift[0].status === ShiftStatus.StartOfWork.toString()) {
        const lastDayOrders =
          (await this.orderService.findByBaristaIDAndForPeriod(
            baristaId,
            lastShift[0].time,
            new Date(),
          )) as Order[];
        if (!lastDayOrders.length) {
          return await this.shiftRepository.save({
            ...createShiftDto,
            baristaSalary: 0,
            barista: { id: baristaId },
          });
        }
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
          barista: { id: baristaId },
        });
      } else
        return new BadRequestException(
          'You can`t end of shift until you start it',
        );
    }
  }
  async getAllShiftsByBarista(id: number, adminID: number) {
    const shifts = await this.shiftRepository.find({
      where: { barista: { id, admin: { id: adminID } } },
      relations: {
        point: true,
      },
    });
    if (!shifts.length) {
      return new BadRequestException(
        `Shifts for Barista with #${id} weren\`t found`,
      );
    }
    return shifts;
  }
  async getAllShiftsByPoint(id: number, adminID: number) {
    const shifts = await this.shiftRepository.find({
      where: { point: { id, admin: { id: adminID } } },
      relations: {
        barista: true,
      },
    });
    if (!shifts.length) {
      return new BadRequestException(`Shifts for Point #${id} weren\`t found`);
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
    if (!shifts.length) {
      return new BadRequestException(`Shifts were not found`);
    }
    return shifts;
  }

  async getCurrentStatus(baristaID: number, adminID: number) {
    const lastShift = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID, admin: { id: adminID } },
      },
      order: { id: 'DESC' },
      take: 1,
    });
    if (!lastShift.length) {
      return new BadRequestException(
        `First shift of barista #${baristaID} has not started yet`,
      );
    }
    if (lastShift[0].status === ShiftStatus.EndOfWork) {
      return { status: ShiftStatus.EndOfWork };
    } else {
      return { status: ShiftStatus.StartOfWork };
    }
  }

  async getBaristaSalaryAndCountOfShiftsForPeriod(
    adminID: number,
    baristaID: number,
    periodFrom: Date,
    periodTo: Date,
  ) {
    let shifts: Shift[];
    if (periodFrom > periodTo) {
      shifts = await this.shiftRepository.find({
        where: {
          barista: { id: baristaID },
          point: { admin: { id: adminID } },
          status: ShiftStatus.EndOfWork,
          time: Between(periodTo, periodFrom),
        },
      });
    } else {
      shifts = await this.shiftRepository.find({
        where: {
          barista: { id: baristaID },
          point: { admin: { id: adminID } },
          status: ShiftStatus.EndOfWork,
          time: Between(periodFrom, periodTo),
        },
      });
    }
    if (!shifts.length) {
      return new BadRequestException(`Shifts were not found`);
    }
    const totalBaristaSalary = shifts.reduce(
      (acc, cur) => acc + cur.baristaSalary,
      0,
    );
    const countOfShifts = shifts.length;
    return { totalBaristaSalary, countOfShifts };
  }
  async getAllBaristasSalaryAndCountOfShiftsForPeriod(
    adminID: number,
    periodFrom: Date,
    periodTo: Date,
  ) {
    let shifts: Shift[];
    if (periodFrom > periodTo) {
      shifts = await this.shiftRepository.find({
        where: {
          point: { admin: { id: adminID } },
          status: ShiftStatus.EndOfWork,
          time: Between(periodTo, periodFrom),
        },
        relations: {
          barista: true,
        },
      });
    } else {
      shifts = await this.shiftRepository.find({
        where: {
          point: { admin: { id: adminID } },
          status: ShiftStatus.EndOfWork,
          time: Between(periodFrom, periodTo),
        },
        relations: {
          barista: true,
        },
      });
    }
    const baristas: BaristasData[] = shifts.map((shift) => {
      return {
        baristaID: shift.barista.id,
        baristaFullName: shift.barista.name + ' ' + shift.barista.surname,
      };
    });
    if (!shifts.length) {
      return new BadRequestException(`Shifts were not found`);
    }
    const totalData = [];
    for (const barista of baristas) {
      const baristaShifts = shifts.filter(
        (shift) => shift.barista.id === barista.baristaID,
      );
      const totalBaristaSalary = baristaShifts.reduce(
        (acc, cur) => acc + cur.baristaSalary,
        0,
      );
      const countOfShifts = baristaShifts.length;
      totalData.push({
        ...barista,
        totalBaristaSalary,
        countOfShifts,
      });
    }
    return totalData;
  }
}

type BaristasData = {
  baristaID: number;
  baristaFullName: string;
};
