import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'src/points/entities/points.entity';
import { Repository } from 'typeorm';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { Barista } from './entities/barista.entity';

@Injectable()
export class BaristaService {
  constructor(
    @InjectRepository(Barista)
    private readonly baristaRepository: Repository<Barista>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}
  async create(createBaristaDto: CreateBaristaDto) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: {
        email: createBaristaDto.email,
      },
    });
    if (exsitedBarista)
      return new BadRequestException(
        `Barista with email ${createBaristaDto.email} has already existed`,
      );
    const newBarista = {
      ...createBaristaDto,
    };
    return await this.baristaRepository.save(newBarista);
  }

  async findAll(adminID: number) {
    return await this.baristaRepository.find({
      where: { admin: { id: adminID } },
    });
  }

  async findOne(id: number, adminID: number) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: { id: id, admin: { id: adminID } },
    });
    if (!exsitedBarista)
      return new BadRequestException(`No Barista with #${id}`);
    return await this.baristaRepository.find({
      where: { id },
      relations: { points: true, shifts: true, orders: true },
    });
  }

  async update(
    id: number,
    adminID: number,
    updateBaristaDto: UpdateBaristaDto,
  ) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: { id: id, admin: { id: adminID } },
    });
    if (!exsitedBarista)
      return new BadRequestException(`No Barista with #${id}`);
    return await this.baristaRepository.update(id, updateBaristaDto);
  }

  async remove(id: number, adminID: number) {
    const exsitedBarista = await this.baristaRepository.findOne({
      where: { id: id, admin: { id: adminID } },
    });
    if (!exsitedBarista)
      return new BadRequestException(`No Barista with #${id}`);
    return await this.baristaRepository.delete(id);
  }

  async setPointToBarista(baristaID: number, pointId: number, adminID: number) {
    const barista = await this.baristaRepository.findOne({
      where: { id: baristaID, admin: { id: adminID } },
    });
    const point = await this.pointRepository.findOne({
      where: { id: pointId, admin: { id: adminID } },
    });
    if (!barista || !point) {
      return new BadRequestException(
        'Check input date, one or both entities are no exist',
      );
    }
    barista.points = [...barista.points, point];
    return await this.baristaRepository.save(barista);
  }
}
