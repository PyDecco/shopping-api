import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('most-requested-products')
  async getMostRequestedProducts() {
    return this.analyticsService.getMostRequestedProducts();
  }

  @Get('daily-sales-volume')
  async getDailySalesVolume() {
    return this.analyticsService.getDailySalesVolume();
  }
}
