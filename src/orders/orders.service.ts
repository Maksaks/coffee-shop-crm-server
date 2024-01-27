import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTodayMidnight } from 'src/helpers/GetingDate.helper';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { OrderPositionService } from 'src/order-position/order-position.service';
import { PointsService } from 'src/points/points.service';
import { RecipeService } from 'src/recipe/recipe.service';
import { Shift, ShiftStatus } from 'src/shifts/entities/shift.entity';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus, PaymentMethod } from './entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(MenuPosition)
    private readonly positionRepository: Repository<MenuPosition>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    private readonly pointService: PointsService,
    private readonly recipeService: RecipeService,
    private readonly orderPositionService: OrderPositionService,
  ) {}
  async create(createOrderDto: CreateOrderDto, baristaID: number) {
    const currentShift = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID },
        point: { id: createOrderDto.point.id },
      },
      relations: { point: true },
      order: { id: 'DESC' },
      take: 1,
    });
    if (!currentShift.length) {
      return new BadRequestException('Shifts for this barista were not found');
    }
    if (
      currentShift[0].status.toString() === ShiftStatus.EndOfWork.toString()
    ) {
      return new BadRequestException('First, you need to start the shift!');
    }
    const costOfIngredients = await this.recipeService.getCostOfIngredientsList(
      createOrderDto.point.id,
      createOrderDto.orderList,
    );

    const orderPositions = await this.orderPositionService.create(
      createOrderDto.orderList,
    );

    let newOrder = await this.orderRepository.save({
      ...createOrderDto,
      costOfIngredients,
      barista: { id: baristaID },
      orderList: orderPositions,
    });
    newOrder = await this.orderRepository.findOne({
      where: { id: newOrder.id },
      relations: { orderList: true, point: true, barista: true },
    });

    if (newOrder.paymentMethod === PaymentMethod.ByCash.toString()) {
      await this.pointService.putMoneyOnBalance(
        newOrder.point.id,
        baristaID,
        newOrder.totalAmount,
      );
    }
    await this.pointService.updateIngredientsOnPoint(
      newOrder.point.id,
      createOrderDto.orderList,
    );

    return newOrder;
  }

  async findAll(adminID: number) {
    const allOrders = await this.orderRepository.find({
      where: { point: { admin: { id: adminID } } },
      relations: { point: true, barista: true, orderList: true },
    });
    if (!allOrders.length) {
      return new BadRequestException('Orders were not found');
    }
    return allOrders;
  }

  async findByPointId(pointID: number, adminID: number) {
    const existedOrderForPoint = await this.orderRepository.find({
      where: { point: { id: pointID, admin: { id: adminID } } },
    });
    if (!existedOrderForPoint.length) {
      return new BadRequestException(
        `Orders for Point #${pointID} were not found`,
      );
    }
    return await this.orderRepository.find({
      where: { point: { id: pointID } },
      relations: { orderList: true, barista: true },
    });
  }

  async findOrdersByBaristaCurrentShift(baristaID: number, adminID: number) {
    const currentShift = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID },
        point: { admin: { id: adminID } },
      },
      relations: { point: true },
      order: { id: 'DESC' },
      take: 1,
    });
    if (!currentShift.length) {
      return new BadRequestException('Shifts for this barista were not found');
    }
    if (
      currentShift[0].status.toString() === ShiftStatus.EndOfWork.toString()
    ) {
      return new BadRequestException('First, you need to start the shift!');
    }
    const currentShiftOrders = await this.orderRepository.find({
      where: {
        barista: { id: baristaID, admin: { id: adminID } },
        point: { id: currentShift[0].point.id },
        createdAt: Between(currentShift[0].time, new Date()),
      },
    });

    if (!currentShiftOrders.length) {
      return new BadRequestException('Orders for current shift were not found');
    }
    return currentShiftOrders;
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
              orderList: true,
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
              orderList: true,
              point: true,
              barista: true,
            },
          });
    if (!existedOrdersForBarista.length) {
      return new BadRequestException(
        `Any orders for barista #${baristaID} during selected period were not found`,
      );
    }
    return existedOrdersForBarista;
  }

  async findOne(id: number, adminID: number) {
    const existedOrder = await this.orderRepository.findOne({
      where: { id, point: { admin: { id: adminID } } },
    });
    if (!existedOrder) {
      return new BadRequestException(`Order with #${id} was not found`);
    }
    return await this.orderRepository.findOne({
      where: { id },
      relations: { barista: true, orderList: true, point: true },
    });
  }

  async completeOrder(orderID: number, adminID: number) {
    const existedOrder = await this.orderRepository.findOne({
      where: { id: orderID, point: { admin: { id: adminID } } },
    });
    if (!existedOrder) {
      return new BadRequestException(`Order with #${orderID} was not found`);
    }
    existedOrder.status = OrderStatus.Ready;
    return await this.orderRepository.save(existedOrder);
  }

  async calculateTotalSumOfOrdersOnTodayByBaristaID(
    baristaID: number,
    adminID: number,
  ) {
    const existedOrder = await this.orderRepository.find({
      where: {
        barista: { id: baristaID, admin: { id: adminID } },
        createdAt: Between(getTodayMidnight(), new Date()),
      },
    });
    if (!existedOrder.length) {
      return new BadRequestException(
        `Orders on today by Barista #${baristaID} were not found`,
      );
    }
    return existedOrder.reduce((acc, cur) => {
      return acc + cur.totalAmount;
    }, 0);
  }
  async remove(id: number, adminID: number) {
    const existedOrderForPoint = await this.orderRepository.findOne({
      where: { id, barista: { admin: { id: adminID } } },
    });
    if (!existedOrderForPoint) {
      return new BadRequestException(`Order with #${id} was not found`);
    }
    return await this.orderRepository.delete(id);
  }
}
