import { Controller, Get, Param, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaginationDto } from '../helpers/dtos/pagination.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findOne(id);
  }
}
