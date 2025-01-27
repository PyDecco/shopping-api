import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartProduct } from '../entities/cart-product.entity';
import { ProductService } from '../product/product.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from '../order/order.service';

describe('CartService', () => {
  let service: CartService;
  
  const mockCartRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCartProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
    findMany: jest.fn(),
  };

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartProduct),
          useValue: mockCartProductRepository,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a cart with valid products', async () => {
      const mockProducts = [{ id: 1 }];
      mockProductService.findMany.mockResolvedValue(mockProducts);
      mockCartProductRepository.create.mockReturnValue({ product: mockProducts[0], quantity: 1 });
      mockCartRepository.create.mockReturnValue({});
      mockCartRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.createCart({ products: [{ productId: 1, quantity: 1 }] });

      expect(result).toEqual({ id: 1 });
      expect(mockProductService.findMany).toHaveBeenCalledWith([1]);
      expect(mockCartRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no valid products are found', async () => {
      mockProductService.findMany.mockResolvedValue([]);

      await expect(service.createCart({ products: [{ productId: 1, quantity: 1 }] })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addProductToCart', () => {
    it('should add a product to the cart', async () => {
      const mockCart = { id: 1, cartProducts: [] };
      const mockProduct = { id: 2, stock: 5 };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue(mockProduct);
      mockCartProductRepository.create.mockReturnValue({ product: mockProduct, quantity: 1 });
      mockCartRepository.findOne.mockResolvedValue(mockCart);

      const result = await service.addProductToCart(1, { productId: 2 });

      expect(result).toEqual(mockCart);
      expect(mockProductService.findOne).toHaveBeenCalledWith(2);
      expect(mockCartProductRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if cart is not found', async () => {
      mockCartRepository.findOne.mockResolvedValue(null);

      await expect(service.addProductToCart(1, { productId: 2 })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product is not found', async () => {
      const mockCart = { id: 1, cartProducts: [] };
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue(null);

      await expect(service.addProductToCart(1, { productId: 2 })).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if product is out of stock', async () => {
      const mockCart = { id: 1, cartProducts: [] };
      const mockProduct = { id: 2, stock: 0 };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue(mockProduct);

      await expect(service.addProductToCart(1, { productId: 2 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeProductFromCart', () => {
    it('should remove a product from the cart', async () => {
      const mockCart = {
        id: 1,
        cartProducts: [{ product: { id: 2 }, quantity: 1 }],
      };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartProductRepository.remove.mockResolvedValue({});

      const result = await service.removeProductFromCart(1, 2);

      expect(result).toEqual(mockCart);
      expect(mockCartProductRepository.remove).toHaveBeenCalled();
    });

    it('should decrement product quantity if greater than 1', async () => {
      const mockCartProduct = { quantity: 2, product: { id: 2 } };
      const mockCart = { id: 1, cartProducts: [mockCartProduct] };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartProductRepository.save.mockResolvedValue({});

      const result = await service.removeProductFromCart(1, 2);

      expect(result).toEqual(mockCart);
      expect(mockCartProductRepository.save).toHaveBeenCalled();
    });
  });

  describe('checkoutCart', () => {
    it('should checkout a cart successfully', async () => {
      const mockCart = {
        id: 1,
        paymentStatus: 'OPEN',
        cartProducts: [
          { quantity: 2, product: { price: '50.00' } },
          { quantity: 1, product: { price: '30.00' } },
        ],
      };
      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockCartRepository.save.mockResolvedValue({
        id: 1,
        paymentStatus: 'PAID',
        paymentDate: new Date(),
      });
      mockOrderService.create.mockResolvedValue({ id: 1, total: 130 });
  
      const result = await service.checkoutCart(1);
  
      expect(result.paymentStatus).toBe('PAID');
      expect(result.paymentDate).toBeDefined();
      expect(mockOrderService.create).toHaveBeenCalledWith({
        total: 130,
        cart: mockCart,
        createdAt: expect.any(Date),
      });
      expect(mockCartRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentStatus: 'PAID',
          paymentDate: expect.any(Date),
        }),
      );
    });

    it('should throw BadRequestException if cart is already paid', async () => {
      const mockCart = { id: 1, paymentStatus: 'PAID' };
      mockCartRepository.findOne.mockResolvedValue(mockCart);

      await expect(service.checkoutCart(1)).rejects.toThrow(BadRequestException);
    });
  });
});
