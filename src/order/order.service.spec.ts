import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PaginationDto } from '../helpers/dtos/pagination.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an order', async () => {
      const createOrderDto: CreateOrderDto = { 
        total: 100, 
        cart: { 
          id: 1, 
          cartProducts: [], 
          order: null, 
          paymentStatus: 'pending', 
          paymentDate: new Date() 
        }, 
        createdAt: new Date() 
      };
      const mockOrder = { id: 1, ...createOrderDto };

      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.create(createOrderDto);

      expect(mockOrderRepository.create).toHaveBeenCalledWith(createOrderDto);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockOrders = [
        { id: 1, total: 100 },
        { id: 2, total: 200 },
      ];
      const totalOrders = 2;

      mockOrderRepository.findAndCount.mockResolvedValue([mockOrders, totalOrders]);

      const result = await service.findAll(paginationDto);

      expect(mockOrderRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({ data: mockOrders, total: totalOrders });
    });
  });

  describe('findOne', () => {
    it('should return an order by ID', async () => {
      const mockOrder = { id: 1, total: 100 };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Order with ID 999 not found'),
      );
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });
});
