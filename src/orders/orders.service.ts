import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTodayMidnight } from 'src/helpers/GetingDate.helper';
import { PointsService } from 'src/points/points.service';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
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

  async findByBaristaIDAndForPeriod(
    baristaID: number,
    periodFrom: Date,
    periodTo: Date,
  ) {
    const existedOrdersForBarista =
      periodFrom < periodTo
        ? await this.orderRepository.find({
            where: {
              barista: { id: baristaID },
              createdAt: Between(periodFrom, periodTo),
            },
            relations: {
              menuPositions: true,
              point: true,
              barista: true,
            },
          })
        : await this.orderRepository.find({
            where: {
              barista: { id: baristaID },
              createdAt: Between(periodTo, periodFrom),
            },
            relations: {
              menuPositions: true,
              point: true,
              barista: true,
            },
          });
    if (existedOrdersForBarista.length) {
      return new BadRequestException(
        `Orders for barista #${baristaID} during selected period were not found`,
      );
    }
    return existedOrdersForBarista;
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
