import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { UpdateProductDto} from './dtos/update-product.dto'
import { PaginationDto } from '../helpers/dtos/pagination.dto';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findMany(ids: number[]): Promise<Product[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('The array of IDs must not be empty');
    }
  
    const products = await this.productRepository.findBy({
      id: In(ids),
    });
    
    if (products.length === 0) {
      throw new NotFoundException(`No products found for the provided IDs`);
    }
  
    return products;
  }
  
  

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
