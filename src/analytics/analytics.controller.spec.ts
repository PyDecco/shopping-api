import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { CartProduct } from '../entities/cart-product.entity';
import { Order } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(CartProduct),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMostRequestedProducts', () => {
    it('should return the most requested products', async () => {
      const result = [
        { productId: 1, count: 5 },
        { productId: 2, count: 3 },
      ];

      jest.spyOn(service, 'getMostRequestedProducts').mockResolvedValue(result);

      const response = await controller.getMostRequestedProducts();
      expect(response).toEqual(result);
    });

    it('should handle empty response', async () => {
      const result = [];

      jest.spyOn(service, 'getMostRequestedProducts').mockResolvedValue(result);

      const response = await controller.getMostRequestedProducts();
      expect(response).toEqual(result);
    });
  });

  describe('getDailySalesVolume', () => {
    it('should return daily sales volume', async () => {
      const result = [
        { date: '2025-01-01', totalSales: 1000.50 },
        { date: '2025-01-02', totalSales: 500.00 },
      ];

      jest.spyOn(service, 'getDailySalesVolume').mockResolvedValue(result);

      const response = await controller.getDailySalesVolume();
      expect(response).toEqual(result);
    });

    it('should handle empty response', async () => {
      const result = [];

      jest.spyOn(service, 'getDailySalesVolume').mockResolvedValue(result);

      const response = await controller.getDailySalesVolume();
      expect(response).toEqual(result);
    });
  });
});
