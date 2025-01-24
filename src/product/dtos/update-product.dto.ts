import { IsString, IsNumber, IsPositive, Min, Max, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional() 
  @IsString()
  name?: string;

  @IsOptional() 
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  price?: number;

  @IsOptional() 
  @IsNumber()
  @IsPositive()
  @Min(0)
  stock?: number;
}
