import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaristaService } from 'src/barista/barista.service';
import { CreateBaristaDto } from 'src/barista/dto/create-barista.dto';
import { UpdateBaristaDto } from 'src/barista/dto/update-barista.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { GetByNameIngredientDto } from 'src/ingredients/dto/get-by-name-ingredient.dto';
import { UpdateIngredientDto } from 'src/ingredients/dto/update-ingredient.dto';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { CreatePositionDto } from 'src/menu-position/dto/create-position.dto';
import { UpdatePositionDto } from 'src/menu-position/dto/update-position.dto';
import { MenuPositionService } from 'src/menu-position/menu-position.service';
import { CreatePointDto } from 'src/points/dto/create-point.dto';
import { UpdatePointDto } from 'src/points/dto/update-point.dto';
import { PointsService } from 'src/points/points.service';
import { RecipeService } from 'src/recipe/recipe.service';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly categoriesService: CategoriesService,
    private readonly baristaService: BaristaService,
    private readonly pointService: PointsService,
    private readonly ingredientService: IngredientsService,
    private readonly menuPositionService: MenuPositionService,
    private readonly recipesService: RecipeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createCategory(@Request() req, @Body() categoryDto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.id, categoryDto);
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard)
  getAllCategories(@Request() req) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Get('categories/:id')
  @UseGuards(JwtAuthGuard)
  getCategoriesById(@Param('id') id: number, @Request() req) {
    return this.categoriesService.findOne(id, req.user.id);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    return this.categoriesService.update(id, req.user.id, updateCategoryDto);
  }
  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  deleteCategory(@Param('id') id: number, @Request() req) {
    return this.categoriesService.remove(id, req.user.id);
  }

  @Post('baristas')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createBarista(@Body() createBaristaDto: CreateBaristaDto, @Request() req) {
    return this.baristaService.create(req.user.id, createBaristaDto);
  }

  @Get('baristas')
  @UseGuards(JwtAuthGuard)
  getAllBaristas(@Request() req) {
    return this.baristaService.findAll(req.user.id);
  }

  @Get('baristas/:id')
  @UseGuards(JwtAuthGuard)
  getBaristaByID(@Param('id') id: number, @Request() req) {
    return this.baristaService.findOne(id, req.user.id);
  }

  @Patch('baristas/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateBarista(
    @Param('id') id: number,
    @Body() updateBaristaDto: UpdateBaristaDto,
    @Request() req,
  ) {
    return this.baristaService.update(id, req.user.id, updateBaristaDto);
  }

  @Delete('baristas/:id')
  @UseGuards(JwtAuthGuard)
  deleteBarista(@Param('id') id: number, @Request() req) {
    return this.baristaService.remove(id, req.user.id);
  }

  @Post('barista/:baristaId/setPoint/:pointID')
  @UseGuards(JwtAuthGuard)
  setPointToBarista(
    @Param('baristaId') baristaId: number,
    @Param('pointID') pointID: number,
    @Request() req,
  ) {
    return this.baristaService.setPointToBarista(
      baristaId,
      pointID,
      req.user.id,
    );
  }
  @Post('barista/:baristaId/removePoint/:pointID')
  @UseGuards(JwtAuthGuard)
  removePointFromBarista(
    @Param('baristaId') baristaId: number,
    @Param('pointID') pointID: number,
    @Request() req,
  ) {
    return this.baristaService.removePointFromBarista(
      baristaId,
      pointID,
      req.user.id,
    );
  }

  @Post('points')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createPoint(@Body() createPointDto: CreatePointDto, @Request() req) {
    return this.pointService.create(req.user.id, createPointDto);
  }

  @Get('points/forBarista/:id')
  @UseGuards(JwtAuthGuard)
  getPointsByBaristaID(@Param('id') id: number, @Request() req) {
    return this.pointService.findPointsByBaristaID(id, req.user.id);
  }

  @Get('points')
  @UseGuards(JwtAuthGuard)
  getAllPoints(@Request() req) {
    return this.pointService.findAll(req.user.id);
  }
  @Get('points/:id')
  @UseGuards(JwtAuthGuard)
  getPoint(@Param('id') id: number, @Request() req) {
    return this.pointService.findOne(id, req.user.id);
  }

  @Patch('points/:id')
  @UseGuards(JwtAuthGuard)
  updatePoint(
    @Param('id') id: number,
    @Request() req,
    @Body() updatePointDto: UpdatePointDto,
  ) {
    return this.pointService.update(id, updatePointDto, req.user.id);
  }

  @Delete('points/:id')
  @UseGuards(JwtAuthGuard)
  deletePoint(@Param('id') id: number, @Request() req) {
    return this.pointService.remove(id, req.user.id);
  }

  @Post('ingredients/:pointID')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  createIngredient(
    @Param('pointID') id: number,
    @Body() createIngredientDto: CreateIngredientDto,
    @Request() req,
  ) {
    return this.ingredientService.create(createIngredientDto, id, req.user.id);
  }

  @Get('ingredients')
  @UseGuards(JwtAuthGuard)
  getAllIngredients(@Request() req) {
    return this.ingredientService.findAll(req.user.id);
  }

  @Get('ingredients/byID/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getIngredientByID(@Param('id') id: number, @Request() req) {
    return this.ingredientService.findOneByID(id, req.user.id);
  }

  @Get('ingredients/byName')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  getIngredientByName(
    @Body() getByNameIngredientDto: GetByNameIngredientDto,
    @Request() req,
  ) {
    return this.ingredientService.findOneByName(
      getByNameIngredientDto.name,
      req.user.id,
    );
  }

  @Get('ingredients/:pointID')
  @UseGuards(JwtAuthGuard)
  getAllIngredientsOnPoint(@Param('pointID') pointID: number, @Request() req) {
    return this.ingredientService.findAllOnPoint(pointID, req.user.id);
  }

  @Patch('ingredients/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateIngredient(
    @Body() updateIngredientDto: UpdateIngredientDto,
    @Request() req,
    @Param('id') id: number,
  ) {
    return this.ingredientService.update(id, req.user.id, updateIngredientDto);
  }

  @Delete('ingredients/:id')
  @UseGuards(JwtAuthGuard)
  deleteIngredient(@Param('id') id: number, @Request() req) {
    return this.ingredientService.remove(id, req.user.id);
  }

  @Post('positions/:pointID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createPosition(
    @Param('pointID') pointID: number,
    @Body() createPositionDto: CreatePositionDto,
    @Request() req,
  ) {
    return this.menuPositionService.create(
      createPositionDto,
      pointID,
      req.user.id,
    );
  }

  @Get('positions/:pointID')
  @UseGuards(JwtAuthGuard)
  getMenu(@Param('pointID') pointID: number, @Request() req) {
    return this.menuPositionService.getMenu(pointID, req.user.id);
  }

  @Get('positions/:pointID/recipe/:positionID')
  @UseGuards(JwtAuthGuard)
  getRecipe(
    @Param('positionID') positionID: number,
    @Param('pointID') pointID: number,
    @Request() req,
  ) {
    return this.menuPositionService.getRecipe(positionID, pointID, req.user.id);
  }

  @Get('positions/:pointID/info/:positionID')
  @UseGuards(JwtAuthGuard)
  getPositionInfo(
    @Param('positionID') positionID: number,
    @Param('pointID') pointID: number,
    @Request() req,
  ) {
    return this.menuPositionService.findOne(positionID, pointID, req.user.id);
  }

  @Patch('positions/:pointID/update/:positionID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updatePosition(
    @Param('positionID') positionID: number,
    @Param('pointID') pointID: number,
    @Request() req,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.menuPositionService.update(
      positionID,
      pointID,
      req.user.id,
      updatePositionDto,
    );
  }

  @Delete('positions/:pointID/delete/:positionID')
  @UseGuards(JwtAuthGuard)
  deletePosition(
    @Param('positionID') positionID: number,
    @Param('pointID') pointID: number,
    @Request() req,
  ) {
    return this.menuPositionService.delete(positionID, pointID, req.user.id);
  }
}
