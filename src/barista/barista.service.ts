import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';
import { Barista } from './entities/barista.entity';

@Injectable()
export class BaristaService {
  constructor(
    @InjectRepository(Barista)
    private readonly baristaRepository: Repository<Barista>,
  ) {}
  create(createBaristaDto: CreateBaristaDto) {
    return 'This action adds a new barista';
  }

  findAll() {
    return `This action returns all barista`;
  }

  findOne(id: number) {
    return `This action returns a #${id} barista`;
  }

  update(id: number, updateBaristaDto: UpdateBaristaDto) {
    return `This action updates a #${id} barista`;
  }

  remove(id: number) {
    return `This action removes a #${id} barista`;
  }
}
