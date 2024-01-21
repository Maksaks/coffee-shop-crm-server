import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(OrderPosition)
    private readonly orderPositionRepository: Repository<OrderPosition>,
  ) {}

  async getStatisticsCountOfPositionsOnCategories(adminID: number) {
    const categoriesData = await this.categoriesRepository.find({
      where: { admin: { id: adminID } },
      relations: { positions: true },
    });
    return categoriesData.map((item) => {
      return {
        id: item.id,
        title: item.title,
        positions_count: item.positions.length,
      };
    });
  }

  async getStatisticsOrdersCountByCategories(adminID: number) {
    const orderPositions = await this.orderPositionRepository.find({
      where: { menuPosition: { point: { admin: { id: adminID } } } },
      relations: { menuPosition: true },
    });
    const categories = await this.categoriesRepository.find({
      where: { admin: { id: adminID } },
      order: { id: 'ASC' },
    });
    const result = [];
    for (const category of categories) {
      const orderByCategory = orderPositions.filter(
        (item) => item.menuPosition.category.title === category.title,
      );
      result.push({
        id: category.id,
        title: category.title,
        orders_count: orderByCategory.length,
      });
    }
    return result;
  }
}
