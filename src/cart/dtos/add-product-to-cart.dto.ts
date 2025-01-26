import { IsNumber } from 'class-validator';

export class AddProductToCartDto {
  @IsNumber()
  productId: number;
}