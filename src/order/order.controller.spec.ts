import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let orderService: Partial<OrderService>;

  beforeAll(async () => {
    // Mock do serviço de pedidos
    orderService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService, // Substitui o serviço real pelo mock
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Adiciona os mesmos pipes globais utilizados na aplicação real
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/order (GET)', () => {
    it('deve retornar uma lista de pedidos com paginação', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const mockOrders = {
        data: [
          {
            id: 1,
            total: 599.97,
            createdAt: "2025-01-26T23:21:21.357Z",
            cart: {
              id: 1,
              cartProducts: [],
              order: null,
              paymentStatus: 'paid',
              paymentDate: "2025-01-26T23:21:21.357Z",
            },
          },
        ],
        total: 1,
      };

      // Mocka o método `findAll` do serviço
      (orderService.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const response = await request(app.getHttpServer())
        .get('/order')
        .query(paginationDto)
        .expect(200);

      expect(response.body).toEqual(mockOrders);
    });

    it('deve retornar erro 400 se os parâmetros de consulta forem inválidos', async () => {
      await request(app.getHttpServer())
        .get('/order')
        .query({ page: 'invalid', limit: 'invalid' })
        .expect(400);
    });
  });

  describe('/order/:id (GET)', () => {
    it('deve retornar um pedido específico pelo ID', async () => {
      const mockOrder = {
        id: 1,
        total: 599.97,
        createdAt: "2025-01-26T23:21:21.357Z",
        cart: {
          id: 1,
          cartProducts: [],
          order: null,
          paymentStatus: 'paid',
          paymentDate: "2025-01-26T23:21:21.357Z",
        },
      };

      // Mocka o método `findOne` do serviço
      (orderService.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app.getHttpServer())
        .get('/order/1')
        .expect(200);

      expect(response.body).toEqual(mockOrder);
    });

    it('deve retornar erro 400 para um ID inválido', async () => {
      await request(app.getHttpServer())
        .get('/order/invalid')
        .expect(400);
    });
  });
});
