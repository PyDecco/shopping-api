import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from '../entities/cart.entity';
import { ProductService } from '../product/product.service';
import { ProductModule } from '../product/product.module';
import { CartProduct } from '../entities/cart-product.entity';
import { OrderService } from '../order/order.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart,CartProduct]),
    ProductModule,
    OrderModule,
  ],
  providers: [CartService, ProductService, OrderService],
  controllers: [CartController], 
  exports: [CartService, TypeOrmModule], 
})
export class CartModule {}
