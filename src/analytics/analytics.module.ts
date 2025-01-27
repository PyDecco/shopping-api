import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Cart } from '../entities/cart.entity';  
import { Order } from '../entities/order.entity'; 
import { CartProduct } from '../entities/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Order, CartProduct])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
