import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PointsService } from 'src/points/points.service';
import { BaristaService } from './barista.service';
import { CreateBaristaDto } from './dto/create-barista.dto';
import { UpdateBaristaDto } from './dto/update-barista.dto';

@Controller('barista')
export class BaristaController {
  constructor(
    private readonly pointService: PointsService,
    private readonly baristaService: BaristaService,
  ) {}

  @Post()
  create(@Body() createBaristaDto: CreateBaristaDto) {
    return this.baristaService.create(createBaristaDto);
  }

  @Get()
  findAll() {
    return this.baristaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baristaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBaristaDto: UpdateBaristaDto) {
    return this.baristaService.update(+id, updateBaristaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.baristaService.remove(+id);
  }
}
