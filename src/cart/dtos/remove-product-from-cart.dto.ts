import { IsNumber } from 'class-validator';

export class RemoveProductFromCartDto {
  @IsNumber()
  productId: number;
}
