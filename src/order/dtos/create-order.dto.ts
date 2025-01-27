import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Cart } from 'src/entities/cart.entity';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  cart: Cart;
}