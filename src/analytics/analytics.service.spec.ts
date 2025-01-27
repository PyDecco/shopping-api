import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProduct } from '../entities/cart-product.entity';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let cartProductRepository: Repository<CartProduct>;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(CartProduct),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    cartProductRepository = module.get<Repository<CartProduct>>(getRepositoryToken(CartProduct));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMostRequestedProducts', () => {
    it('should return the most requested products', async () => {
      const result = [
        { productId: 1, count: 5 },
        { productId: 2, count: 3 },
      ];

      jest.spyOn(cartProductRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(result),
      } as any);

      const products = await service.getMostRequestedProducts();
      expect(products).toEqual(result);
    });
  });

  describe('getDailySalesVolume', () => {
    it('should return daily sales volume', async () => {
      const result = [
        { date: '2025-01-01', totalSales: 1000.50 },
        { date: '2025-01-02', totalSales: 500.00 },
      ];

      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(result),
      } as any);

      const salesVolume = await service.getDailySalesVolume();
      expect(salesVolume).toEqual(result);
    });
  });
});
