import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'src/entities/cart.entity';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { CartProduct } from 'src/entities/cart-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart,CartProduct]),
    ProductModule,
  ],
  providers: [CartService, ProductService],
  controllers: [CartController], // Registra o controlador do Cart
  exports: [CartService, TypeOrmModule], // Exporte o CartService e o TypeOrmModule para outros módulos

})
export class CartModule {}
