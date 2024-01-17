import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaristaService } from 'src/barista/barista.service';
import { CreateBaristaDto } from 'src/barista/dto/create-barista.dto';
import { UpdateBaristaDto } from 'src/barista/dto/update-barista.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { CreatePointDto } from 'src/points/dto/create-point.dto';
import { UpdatePointDto } from 'src/points/dto/update-point.dto';
import { PointsService } from 'src/points/points.service';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly categoriesService: CategoriesService,
    private readonly baristaService: BaristaService,
    private readonly pointService: PointsService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('categories')
  @UsePipes(new ValidationPipe())
  createCategory(@Body() categoryDto: CreateCategoryDto) {
    return this.categoriesService.create(1, categoryDto);
  }

  @Get('categories')
  getAllCategories() {
    return this.categoriesService.findAll(1);
  }

  @Get('categories/:id')
  getCategoriesById(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch('categories/:id')
  @UsePipes(new ValidationPipe())
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, 1, updateCategoryDto);
  }
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: number) {
    return this.categoriesService.remove(id, 1);
  }

  @Post('baristas')
  @UsePipes(new ValidationPipe())
  createBarista(@Body() createBaristaDto: CreateBaristaDto) {
    return this.baristaService.create(1, createBaristaDto);
  }

  @Get('baristas')
  getAllBaristas() {
    return this.baristaService.findAll(1);
  }

  @Get('baristas/:id')
  getBaristaByID(@Param('id') id: number) {
    return this.baristaService.findOne(id);
  }

  @Patch('baristas/:id')
  @UsePipes(new ValidationPipe())
  updateBarista(
    @Param('id') id: number,
    @Body() updateBaristaDto: UpdateBaristaDto,
  ) {
    return this.baristaService.update(id, 1, updateBaristaDto);
  }

  @Delete('baristas/:id')
  deleteBarista(@Param('id') id: number) {
    return this.baristaService.remove(id, 1);
  }

  @Post('barista/:baristaId/setPoint/:pointID')
  setPointToBarista(
    @Param('baristaId') baristaId: number,
    @Param('pointID') pointID: number,
  ) {
    return this.baristaService.setPointToBarista(baristaId, pointID, 1);
  }
  @Post('barista/:baristaId/removePoint/:pointID')
  removePointToBarista(
    @Param('baristaId') baristaId: number,
    @Param('pointID') pointID: number,
  ) {
    return this.baristaService.removePointFromBarista(baristaId, pointID, 1);
  }

  @Post('points')
  @UsePipes(new ValidationPipe())
  createPoint(@Body() createPointDto: CreatePointDto) {
    return this.pointService.create(1, createPointDto);
  }

  @Get('points/forBarista/:id')
  getPointsByBaristaID(@Param('id') id: number) {
    return this.pointService.findPointsByBaristaID(id, 1);
  }

  @Get('points')
  getAllPoints() {
    return this.pointService.findAll(1);
  }
  @Get('points/:id')
  getPoint(@Param('id') id: number) {
    return this.pointService.findOne(id, 1);
  }

  @Patch('points/:id')
  updatePoint(@Param('id') id: number, @Body() updatePointDto: UpdatePointDto) {
    return this.pointService.update(id, updatePointDto, 1);
  }

  @Delete('points/:id')
  deletePoint(@Param('id') id: number) {
    return this.pointService.remove(id, 1);
  }
}
