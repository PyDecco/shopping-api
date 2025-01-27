import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let orderService: Partial<OrderService>;

  beforeAll(async () => {
    orderService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService, 
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/order (GET)', () => {
    it('It should return a list of orders with pagination.', async () => {
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

      (orderService.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const response = await request(app.getHttpServer())
        .get('/order')
        .query(paginationDto)
        .expect(200);

      expect(response.body).toEqual(mockOrders);
    });

    it('It should return a 400 error if the query parameters are invalid.', async () => {
      await request(app.getHttpServer())
        .get('/order')
        .query({ page: 'invalid', limit: 'invalid' })
        .expect(400);
    });
  });

  describe('/order/:id (GET)', () => {
    it('It should return a specific order by ID.', async () => {
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

      (orderService.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app.getHttpServer())
        .get('/order/1')
        .expect(200);

      expect(response.body).toEqual(mockOrder);
    });

    it('It should return a 400 error for an invalid ID.', async () => {
      await request(app.getHttpServer())
        .get('/order/invalid')
        .expect(400);
    });
  });
});
