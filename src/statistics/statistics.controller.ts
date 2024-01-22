import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { AllowedRoles } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enums/roles.enum';
import { PeriodForStatistic } from './dto/period-statistic.dto';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('positions/:pointID')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @AllowedRoles(Roles.Admin)
  getPopularityOfMenuPositionByPoint(
    @Param('pointID') pointID: number,
    @Body() periodForStatistic: PeriodForStatistic,
    @Request() req,
  ) {
    return this.statisticsService.getPopularityOfMenuPositionByPoint(
      pointID,
      req.user.id,
      periodForStatistic.from,
      periodForStatistic.to,
    );
  }

  @Get('points/:pointID')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @AllowedRoles(Roles.Admin)
  getExpensesAndIncomesByPoint(
    @Param('pointID') pointID: number,
    @Body() periodForStatistic: PeriodForStatistic,
    @Request() req,
  ) {
    return this.statisticsService.getExpensesAndIncomesByPoint(
      pointID,
      req.user.id,
      periodForStatistic.from,
      periodForStatistic.to,
    );
  }

  @Get('points')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @AllowedRoles(Roles.Admin)
  getAllExpensesAndIncomes(
    @Body() periodForStatistic: PeriodForStatistic,
    @Request() req,
  ) {
    return this.statisticsService.getAllExpensesAndIncomes(
      req.user.id,
      periodForStatistic.from,
      periodForStatistic.to,
    );
  }

  @Get('baristas/:baristaID')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @AllowedRoles(Roles.Admin)
  getBaristaInfoById(
    @Param('baristaID') baristaID: number,
    @Body() periodForStatistic: PeriodForStatistic,
    @Request() req,
  ) {
    return this.statisticsService.getBaristaInfoById(
      baristaID,
      req.user.id,
      periodForStatistic.from,
      periodForStatistic.to,
    );
  }

  @Get('baristas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  @AllowedRoles(Roles.Admin)
  getAllBaristasInfo(
    @Body() periodForStatistic: PeriodForStatistic,
    @Request() req,
  ) {
    return this.statisticsService.getAllBaristasInfo(
      req.user.id,
      periodForStatistic.from,
      periodForStatistic.to,
    );
  }
}
