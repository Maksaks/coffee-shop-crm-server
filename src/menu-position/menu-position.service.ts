import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuPosition } from './entities/menu-position.entity';

@Injectable()
export class MenuPositionService {
  constructor(
    @InjectRepository(MenuPosition)
    private readonly menuPositionRepository: Repository<MenuPosition>,
  ) {}
}
