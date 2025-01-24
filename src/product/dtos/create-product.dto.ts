import { IsString, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  price: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  stock: number;
}
