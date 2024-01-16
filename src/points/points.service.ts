import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Point } from './entities/points.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}
  async create(createPointDto: CreatePointDto) {
    const existedPoint = await this.pointRepository.findOne({
      where: { name: createPointDto.name },
    });
    if (existedPoint) {
      return new BadRequestException(
        `Point with name "${createPointDto.name}" has already existed`,
      );
    }
    return await this.pointRepository.save(createPointDto);
  }

  async findPointsByBaristaID(baristaID: number, adminID: number) {
    const existedPoint = await this.pointRepository.find({
      where: { barista: { id: baristaID }, admin: { id: adminID } },
    });
    if (existedPoint.length) {
      return new BadRequestException(
        `Points for Barista #${baristaID} were not found`,
      );
    }
    return await this.pointRepository.find({
      where: { barista: { id: baristaID } },
    });
  }

  async findAll(adminID: number) {
    return await this.pointRepository.find({
      where: { admin: { id: adminID } },
      relations: { barista: true, ingredients: true, orders: true },
    });
  }

  async findOne(id: number, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.findOne({
      where: { id },
      relations: { barista: true, ingredients: true, orders: true },
    });
  }
  async update(id: number, updatePointDto: UpdatePointDto, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.update(id, updatePointDto);
  }

  async remove(id: number, adminID: number) {
    const existedPoint = await this.pointRepository.findOne({
      where: { id, admin: { id: adminID } },
    });
    if (!existedPoint) {
      return new BadRequestException(`Point #${id} was not found`);
    }
    return await this.pointRepository.delete(id);
  }
}
