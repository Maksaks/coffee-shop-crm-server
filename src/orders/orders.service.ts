import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatesEnum } from 'src/enums/DatesEnum.enum';
import {
  getMonthBefore,
  getTodayMidnight,
  getWeekBefore,
  getYearBefore,
} from 'src/helpers/GetingDate.helper';
import { PointsService } from 'src/points/points.service';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, PaymentMethod } from './entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly pointService: PointsService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    if (createOrderDto.paymentMethod === PaymentMethod.ByCash) {
      const differenceBetweenReceiveAndTotal =
        createOrderDto.receivedAmount - createOrderDto.totalAmount;
      if (differenceBetweenReceiveAndTotal !== 0) {
        await this.pointService.getMoneyFromBalance(
          createOrderDto.point.id,
          createOrderDto.barista.id,
          differenceBetweenReceiveAndTotal,
        );
      }
      await this.pointService.putMoneyOnBalance(
        createOrderDto.point.id,
        createOrderDto.barista.id,
        createOrderDto.totalAmount,
      );
    }
    await this.pointService.updateIngredientsOnPoint(
      createOrderDto.point.id,
      createOrderDto.menuPositions,
    );

    return await this.orderRepository.save(createOrderDto);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const existedOrder = await this.orderRepository.findOne({ where: { id } });
    if (!existedOrder) {
      return new BadRequestException(`Order with #${id} was not found`);
    }
    return await this.orderRepository.update(id, updateOrderDto);
  }
  async findAll() {
    return await this.orderRepository.find({
      relations: { point: true, barista: true, menuPositions: true },
    });
  }

  async findByPointId(pointID: number) {
    const existedOrderForPoint = await this.orderRepository.find({
      where: { point: { id: pointID } },
    });
    if (existedOrderForPoint.length) {
      return new BadRequestException(
        `Orders for Point #${pointID} were not found`,
      );
    }
    return await this.orderRepository.find({
      where: { point: { id: pointID } },
      relations: { menuPositions: true, barista: true },
    });
  }

  async findByBaristaIDAndForPeriod(baristaID: number, period: DatesEnum) {
    if (period === DatesEnum.CurrentDay) {
      const existedOrdersForBaristaForCurrentDay =
        await this.orderRepository.find({
          where: {
            barista: { id: baristaID },
            createdAt: Between(getTodayMidnight(), new Date()),
          },
          relations: {
            menuPositions: true,
            point: true,
            barista: true,
          },
        });
      if (existedOrdersForBaristaForCurrentDay.length) {
        return new BadRequestException(
          `Orders for barista #${baristaID} during today were not found`,
        );
      }
      return existedOrdersForBaristaForCurrentDay;
    }
    if (period === DatesEnum.CurrentWeek) {
      const existedOrdersForBaristaForCurrentWeek =
        await this.orderRepository.find({
          where: {
            barista: { id: baristaID },
            createdAt: Between(getWeekBefore(), new Date()),
          },
          relations: {
            menuPositions: true,
            point: true,
          },
        });
      if (existedOrdersForBaristaForCurrentWeek.length) {
        return new BadRequestException(
          `Orders for barista #${baristaID} during last week were not found`,
        );
      }
      return existedOrdersForBaristaForCurrentWeek;
    }
    if (period === DatesEnum.CurrentMonth) {
      const existedOrdersForBaristaForCurrentMonth =
        await this.orderRepository.find({
          where: {
            barista: { id: baristaID },
            createdAt: Between(getMonthBefore(), new Date()),
          },
          relations: {
            menuPositions: true,
            point: true,
          },
        });
      if (existedOrdersForBaristaForCurrentMonth.length) {
        return new BadRequestException(
          `Orders for barista #${baristaID} during last month were not found`,
        );
      }
      return existedOrdersForBaristaForCurrentMonth;
    }
    if (period === DatesEnum.CurrentYear) {
      const existedOrdersForBaristaForCurrentYear =
        await this.orderRepository.find({
          where: {
            barista: { id: baristaID },
            createdAt: Between(getYearBefore(), new Date()),
          },
          relations: {
            menuPositions: true,
            point: true,
          },
        });
      if (existedOrdersForBaristaForCurrentYear.length) {
        return new BadRequestException(
          `Orders for barista #${baristaID} during last year were not found`,
        );
      }
      return existedOrdersForBaristaForCurrentYear;
    }
  }
  async findOne(id: number) {
    const existedOrder = await this.orderRepository.findOne({ where: { id } });
    if (!existedOrder) {
      return new BadRequestException(`Order with #${id} was not found`);
    }
    return await this.orderRepository.findOne({
      where: { id },
      relations: { barista: true, menuPositions: true, point: true },
    });
  }

  async calculateTotalSumOfOrdersOnTodayByBaristaID(baristaID: number) {
    const existedOrder = await this.orderRepository.find({
      where: {
        barista: { id: baristaID },
        createdAt: Between(getTodayMidnight(), new Date()),
      },
    });
    if (existedOrder.length) {
      return new BadRequestException(
        `Orders on today by Barista #${baristaID} were not found`,
      );
    }
    return existedOrder.reduce((acc, cur) => {
      return acc + cur.totalAmount;
    }, 0);
  }
  async remove(id: number) {
    const existedOrderForPoint = await this.orderRepository.find({
      where: { id },
    });
    if (existedOrderForPoint.length) {
      return new BadRequestException(`Order with #${id} was not found`);
    }
    return await this.orderRepository.delete(id);
  }
}
