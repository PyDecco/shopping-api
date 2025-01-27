import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity'; 
import { CartProduct } from '../entities/cart-product.entity';  

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(CartProduct) private cartProductRepository: Repository<CartProduct>, 
  ) {}

  async getMostRequestedProducts() {
    const query = this.cartProductRepository
      .createQueryBuilder('cartProduct')
      .select('cartProduct.productId, COUNT(cartProduct.productId)', 'count')
      .groupBy('cartProduct.productId')
      .orderBy('count', 'DESC')
      .limit(10);

    return query.getRawMany();
  }

  async getDailySalesVolume() {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.createdAt)', 'date')
      .addSelect('SUM(order.total)', 'totalSales')
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC');

    return query.getRawMany();
  }
}
