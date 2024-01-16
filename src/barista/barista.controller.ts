import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaristaService } from './barista.service';
import { CreateBaristaDto } from './dto/create-barista.dto';

@Controller('barista')
export class BaristaController {
  constructor(private readonly baristaService: BaristaService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  registerBarista(@Body() createBaristaDto: CreateBaristaDto) {
    return this.baristaService.create(createBaristaDto);
  }
  @Get(':id')
  getBarista(@Param('id') id: number) {
    return this.baristaService.findOne(id);
  }
}
