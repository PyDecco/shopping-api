import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationDto } from '../helpers/dtos/pagination.dto';
import { NotFoundException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('ProductController', () => {
  let app: INestApplication;
  let productService: ProductService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productService = moduleFixture.get<ProductService>(ProductService);
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = { name: 'Product 1', price: 100, stock: 50 };
    
    // Adicionando a propriedade 'carts' ao objeto 'product'
    const product = { id: 1, ...createProductDto, carts: [] };
  
    // Mockando a criação do produto
    jest.spyOn(productService, 'create').mockResolvedValue(product);
  
    // Realizando a requisição POST para criar o produto
    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(HttpStatus.CREATED);
  
    // Verificando se a resposta é a mesma que o produto mockado
    expect(response.body).toEqual(product);
  });

  it('should return all products with pagination', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const products = [
      { id: 1, name: 'Product 1', price: 100, stock: 50, carts: [] },
      { id: 2, name: 'Product 2', price: 200, stock: 30, carts: [] },
    ];

    jest.spyOn(productService, 'findAll').mockResolvedValue({ data: products, total: 2 });

    const response = await request(app.getHttpServer())
      .get('/products')
      .query(paginationDto)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      data: products,
      total: 2,
    });
  });

  it('should return a product by id', async () => {
    const product = { id: 1, name: 'Product 1', price: 100, stock: 50, carts: [] };

    jest.spyOn(productService, 'findOne').mockResolvedValue(product);

    const response = await request(app.getHttpServer())
      .get('/products/1')
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(product);
  });

  it('should throw NotFoundException if product is not found', async () => {
    jest.spyOn(productService, 'findOne').mockResolvedValue(null);

    await request(app.getHttpServer())
      .get('/products/1')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should update a product', async () => {
    const updateProductDto: UpdateProductDto = { name: 'Updated Product', price: 150 };
    const updatedProduct = { id: 1, name: 'Updated Product', price: 150, stock: 50, carts: [] };

    jest.spyOn(productService, 'update').mockResolvedValue(updatedProduct);

    const response = await request(app.getHttpServer())
      .put('/products/1')
      .send(updateProductDto)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(updatedProduct);
  });

  it('should remove a product', async () => {
    jest.spyOn(productService, 'remove').mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .delete('/products/1')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
