import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { Cart } from './entities/cart.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';

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
      entities: [Cart, Product, Order],
      synchronize: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
