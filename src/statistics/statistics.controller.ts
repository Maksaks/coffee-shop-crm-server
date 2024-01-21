import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('categories/positions/count')
  @UseGuards(JwtAuthGuard)
  getStatisticsCountOfPositionsOnCategories(@Request() req) {
    return this.statisticsService.getStatisticsCountOfPositionsOnCategories(
      req.user.id,
    );
  }

  @Get('categories/categories/orders')
  @UseGuards(JwtAuthGuard)
  getStatisticsOrdersCountByCategories(@Request() req) {
    return this.statisticsService.getStatisticsOrdersCountByCategories(
      req.user.id,
    );
  }
}
