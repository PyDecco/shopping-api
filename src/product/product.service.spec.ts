import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto = { name: 'Product 1', price: 100, stock: 50 };
    
    const product = { id: 1, ...createProductDto, carts: [] };
  
    jest.spyOn(repo, 'create').mockReturnValue(product as any); 
    jest.spyOn(repo, 'save').mockResolvedValue(product); 
  
    expect(await service.create(createProductDto)).toEqual(product); 
  });

  it('should find all products', async () => {
    const products = [
      { id: 1, name: 'Product 1', price: 100, stock: 50, carts: [] },
      { id: 2, name: 'Product 2', price: 200, stock: 30, carts: [] },
    ];
    jest.spyOn(repo, 'findAndCount').mockResolvedValue([products, 2]);

    expect(await service.findAll({ page: 1, limit: 10 })).toEqual({
      data: products,
      total: 2,
    });
  });

  it('should find one product by id', async () => {
    const product = { id: 1, name: 'Product 1', price: 100, stock: 50, carts: [] };
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(product);

    expect(await service.findOne(1)).toEqual(product);
  });

  it('should throw NotFoundException when product not found', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(null); // Simula que nenhum produto foi encontrado
  
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException); // Verifica se a exceção é lançada
  });

  it('should update a product', async () => {
    const updateProductDto = { name: 'Updated Product', price: 150 };
    const originalProduct = { id: 1, name: 'Product 1', price: 100, stock: 50, carts: [] };
    const updatedProduct = { ...originalProduct, ...updateProductDto };

    jest.spyOn(repo, 'update').mockResolvedValue(undefined);

    jest.spyOn(service, 'findOne').mockResolvedValue(updatedProduct);

    const result = await service.update(1, updateProductDto);

    expect(result).toEqual(updatedProduct);
  });

  it('should remove a product', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue(undefined);

    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});