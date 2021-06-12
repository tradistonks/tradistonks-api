import { Controller, Get, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get('search')
  async searchStocks(@Query('q') search: string) {
    return await this.stocksService.searchStocks(search);
  }
}
