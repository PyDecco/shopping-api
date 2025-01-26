import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'The products array must contain at least one product.' }) // Mensagem customizada para array vazio
  products: ProductQuantityDto[];
}

export class ProductQuantityDto {
  @IsNotEmpty({ message: 'Product ID must not be empty.' }) // Mensagem para campo vazio
  @IsNumber({}, { message: 'Product ID must be a valid number.' }) // Validação para número
  productId: number;

  @IsNotEmpty({ message: 'Quantity must not be empty.' }) // Mensagem para campo vazio
  @IsInt({ message: 'Quantity must be an integer.' }) // Validação para inteiro
  @Min(1, { message: 'Quantity must be at least 1.' }) // Validação para valor mínimo
  quantity: number;
}
