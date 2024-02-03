import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barista } from 'src/barista/entities/barista.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { OrderPosition } from 'src/order-position/entities/order-position.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Point } from 'src/points/entities/points.entity';
import { Shift, ShiftStatus } from 'src/shifts/entities/shift.entity';
import { Between } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { TableItem } from './interfaces/TableItem.interface';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(OrderPosition)
    private readonly orderPositionRepository: Repository<OrderPosition>,
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Barista)
    private readonly baristaRepository: Repository<Barista>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getPopularityOfMenuPositionByPoint(
    pointID: number,
    adminID: number,
    from: Date,
    to: Date,
  ) {
    const allOrdersPositionByPoint = await this.orderPositionRepository.find({
      where: {
        order: {
          point: { id: pointID, admin: { id: adminID } },
          createdAt: from < to ? Between(from, to) : Between(to, from),
        },
      },
      relations: { menuPosition: true },
    });
    const tableOfPopularity = new Map<number, TableItem>();
    allOrdersPositionByPoint.map((item) => {
      const position = tableOfPopularity.get(item.menuPosition.id);
      if (position) {
        position.number_of_ordering += item.quantity;
        tableOfPopularity.set(item.menuPosition.id, position);
      } else {
        const key = item.menuPosition.id;
        const value: TableItem = {
          name: item.menuPosition.name,
          category: item.menuPosition.category.title,
          number_of_ordering: item.quantity,
        };
        tableOfPopularity.set(key, value);
      }
    });
    const resultList = [];
    for (const [key, value] of tableOfPopularity) {
      resultList.push({
        id: key,
        ...value,
      });
    }
    return resultList;
  }

  async getExpensesAndIncomesByPoint(
    pointID: number,
    adminID: number,
    from: Date,
    to: Date,
  ) {
    const ordersByPoint = await this.orderRepository.find({
      where: {
        point: { id: pointID, admin: { id: adminID } },
        createdAt: from < to ? Between(from, to) : Between(to, from),
      },
      relations: { point: true },
    });
    const incomesFromOrders = ordersByPoint.reduce((acc, cur) => {
      return acc + cur.totalAmount - cur.costOfIngredients;
    }, 0);
    const shiftsByPoint = await this.shiftRepository.find({
      where: {
        point: { id: pointID, admin: { id: adminID } },
        status: ShiftStatus.EndOfWork,
        time: from < to ? Between(from, to) : Between(to, from),
      },
    });
    const expensesOnShifts = shiftsByPoint.reduce(
      (acc, cur) => acc + cur.baristaSalary,
      0,
    );

    return {
      id: pointID,
      name: ordersByPoint.length
        ? ordersByPoint[0].point.name
        : 'Information was not found',
      orders: {
        orders_count: ordersByPoint.length,
        orders_sum: incomesFromOrders,
      },
      shifts: {
        shifts_count: shiftsByPoint.length,
        shifts_sum: expensesOnShifts,
      },
      profit: incomesFromOrders - expensesOnShifts,
    };
  }
  async getAllExpensesAndIncomes(adminID: number, from: Date, to: Date) {
    type PointData = {
      name: string;
      incomes: number;
      expenses: number;
    };
    const totalData = new Map<number, PointData>();
    const ordersByPoint = await this.orderRepository.find({
      where: {
        point: { admin: { id: adminID } },
        createdAt: from < to ? Between(from, to) : Between(to, from),
      },
      relations: { point: true },
    });

    ordersByPoint.map((order) => {
      const item = totalData.get(order.point.id);
      if (!item) {
        totalData.set(order.point.id, {
          name: order.point.name,
          incomes: order.totalAmount - order.costOfIngredients,
          expenses: 0,
        });
      } else {
        item.incomes += order.totalAmount - order.costOfIngredients;
        totalData.set(order.point.id, item);
      }
    });

    const shiftsByPoint = await this.shiftRepository.find({
      where: {
        point: { admin: { id: adminID } },
        status: ShiftStatus.EndOfWork,
        time: from < to ? Between(from, to) : Between(to, from),
      },
      relations: { point: true },
    });
    shiftsByPoint.map((shift) => {
      const item = totalData.get(shift.point.id);
      if (!item) {
        totalData.set(shift.point.id, {
          name: shift.point.name,
          incomes: 0,
          expenses: shift.baristaSalary,
        });
      } else {
        item.expenses += shift.baristaSalary;
        totalData.set(shift.point.id, item);
      }
    });
    const resultList = [];
    for (const [key, value] of totalData) {
      resultList.push({
        id: key,
        ...value,
      });
    }
    return resultList;
  }

  async getBaristaInfoById(
    baristaID: number,
    adminID: number,
    from: Date,
    to: Date,
  ) {
    const baristaShifts = await this.shiftRepository.find({
      where: {
        barista: { id: baristaID, admin: { id: adminID } },
        status: ShiftStatus.EndOfWork,
        time: from < to ? Between(from, to) : Between(to, from),
      },
      relations: { barista: true, point: true },
    });
    const shifts_count = baristaShifts.length;
    const totalSalary = baristaShifts.reduce((acc, cur) => {
      return acc + cur.baristaSalary;
    }, 0);

    return {
      barista_name: baristaShifts[0]
        ? baristaShifts[0].barista.surname + ' ' + baristaShifts[0].barista.name
        : 'Not found',
      barista_email: baristaShifts[0]
        ? baristaShifts[0].barista.email
        : 'Not found',
      barista_phone_number: baristaShifts[0]
        ? baristaShifts[0].barista.phoneNumber
        : 'Not found',
      barista_date_of_employment: baristaShifts[0]
        ? baristaShifts[0].barista.dateOfEmployment
        : 'Not found',
      barista_hour_rate: baristaShifts[0]
        ? baristaShifts[0].barista.fixedHourRate
        : 'Not found',
      barista_percent: baristaShifts[0]
        ? baristaShifts[0].barista.percentFromEarnings
        : 'Not found',
      shifts_count,
      totalSalary,
    };
  }

  async getAllBaristasInfo(adminID: number, from: Date, to: Date) {
    type PointData = {
      name: string;
      salary: number;
      count_of_shifts: number;
    };
    const totalData = new Map<number, PointData>();

    const baristaShifts = await this.shiftRepository.find({
      where: {
        barista: { admin: { id: adminID } },
        status: ShiftStatus.EndOfWork,
        time: from < to ? Between(from, to) : Between(to, from),
      },
      relations: { barista: true, point: true },
    });

    baristaShifts.map((shift) => {
      const item = totalData.get(shift.barista.id);
      if (!item) {
        totalData.set(shift.barista.id, {
          name: shift.barista.surname + ' ' + shift.barista.name,
          count_of_shifts: 1,
          salary: shift.baristaSalary,
        });
      } else {
        item.count_of_shifts += 1;
        item.salary += shift.baristaSalary;
        totalData.set(shift.barista.id, item);
      }
    });

    const resultList = [];
    for (const [key, value] of totalData) {
      resultList.push({
        id: key,
        ...value,
      });
    }
    return resultList;
  }

  async getConsumptionOfIngredientsByPoint(
    pointID: number,
    adminID: number,
    from: Date,
    to: Date,
  ) {
    type IngredientData = {
      name: string;
      price: number;
      consumption: number;
    };
    const totalData = new Map<number, IngredientData>();
    const orderPositionsByPoint = await this.orderPositionRepository.find({
      where: {
        menuPosition: { point: { id: pointID, admin: { id: adminID } } },
        order: { createdAt: from < to ? Between(from, to) : Between(to, from) },
      },
      relations: { menuPosition: true },
    });

    orderPositionsByPoint.map((position) => {
      position.menuPosition.recipe.ingredients.map((ingredient) => {
        const data = totalData.get(ingredient.id);
        if (!data) {
          totalData.set(ingredient.id, {
            name: ingredient.name,
            price: ingredient.price,
            consumption: position.quantity,
          });
        } else {
          data.consumption += position.quantity;
          totalData.set(ingredient.id, data);
        }
      });
    });
    const resultList = [];
    for (const [key, value] of totalData) {
      resultList.push({
        id: key,
        ...value,
      });
    }
    return resultList;
  }

  async getOrdersCountByCategories(adminID: number, from: Date, to: Date) {
    type CategoryData = {
      title: string;
      orders_count: number;
      total_income: number;
    };
    const totalData = new Map<number, CategoryData>();
    const orderPositionsByPoint = await this.orderPositionRepository.find({
      where: {
        menuPosition: { point: { admin: { id: adminID } } },
        order: { createdAt: from < to ? Between(from, to) : Between(to, from) },
      },
      relations: { menuPosition: true, order: true },
    });

    orderPositionsByPoint.map((orderPosition) => {
      const data = totalData.get(orderPosition.menuPosition.category.id);
      if (!data) {
        totalData.set(orderPosition.menuPosition.category.id, {
          title: orderPosition.menuPosition.category.title,
          total_income:
            (orderPosition.menuPosition.price -
              orderPosition.menuPosition.recipe.ingredients.reduce(
                (acc, cur) => acc + cur.price,
                0,
              )) *
            orderPosition.quantity,
          orders_count: 1,
        });
      } else {
        data.orders_count += 1;
        data.total_income +=
          orderPosition.menuPosition.price -
          orderPosition.menuPosition.recipe.ingredients.reduce(
            (acc, cur) => acc + cur.price,
            0,
          ) *
            orderPosition.quantity;
        totalData.set(orderPosition.menuPosition.category.id, data);
      }
    });
    const resultList = [];
    for (const [key, value] of totalData) {
      resultList.push({
        id: key,
        ...value,
      });
    }
    return resultList;
  }
}
