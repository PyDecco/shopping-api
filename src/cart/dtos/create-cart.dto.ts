import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'The products array must contain at least one product.' })
  products: ProductQuantityDto[];
}

export class ProductQuantityDto {
  @IsNotEmpty({ message: 'Product ID must not be empty.' }) 
  @IsNumber({}, { message: 'Product ID must be a valid number.' }) 
  productId: number;

  @IsNotEmpty({ message: 'Quantity must not be empty.' }) 
  @IsInt({ message: 'Quantity must be an integer.' })
  @Min(1, { message: 'Quantity must be at least 1.' })
  quantity: number;
}
