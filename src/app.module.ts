import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { Cart } from './entities/cart.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { CartProduct } from './entities/cart-product.entity';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [Cart, Product, Order, CartProduct],
      synchronize: true,
    }),
    ProductModule,
    CartModule,
    OrderModule,
    AnalyticsModule,
  ],
  controllers: [OrderController, CartController],
  providers: [OrderService, CartService],
})
export class AppModule {}
