import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { AddProductToCartDto } from './dtos/add-product-to-cart.dto';
import { RemoveProductFromCartDto } from './dtos/remove-product-from-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(@Body() dto: CreateCartDto) {
    return await this.cartService.createCart(dto);
  }

  @Patch(':id/products/add')
  async addProductToCart(@Param('id') id: number, @Body() dto: AddProductToCartDto) {
    return await this.cartService.addProductToCart(id, dto);
  }

  @Patch(':id/products/remove')
  async removeProductFromCart(@Param('id') id: number, @Body() dto: RemoveProductFromCartDto) {
    return await this.cartService.removeProductFromCart(id, dto.productId);
  }

  @Post(':id/checkout')
  async checkoutCart(@Param('id') id: number) {
    return await this.cartService.checkoutCart(id);
  }
}

