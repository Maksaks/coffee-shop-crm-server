import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Repository } from 'typeorm';
import { OrderPosition } from './entities/order-position.entity';

@Injectable()
export class OrderPositionService {
  constructor(
    @InjectRepository(OrderPosition)
    private readonly orderPositionRepository: Repository<OrderPosition>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
  ) {}
  async create(positions: OrderPosition[]) {
    return await this.orderPositionRepository.save(positions);
  }

  async getOrderList(orderID: number, adminID: number) {
    const orderList = await this.orderPositionRepository.find({
      where: {
        order: { id: orderID },
        menuPosition: { point: { admin: { id: adminID } } },
      },
      relations: {
        menuPosition: true,
      },
    });
    if (!orderList.length) {
      throw new BadRequestException(`Order #${orderID} was not found`);
    }
    return orderList;
  }
}
