import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { AddProductToCartDto } from './dtos/add-product-to-cart.dto';
import { RemoveProductFromCartDto } from './dtos/remove-product-from-cart.dto';

describe('CartController', () => {
  let cartController: CartController;

  const mockCartService = {
    createCart: jest.fn(),
    addProductToCart: jest.fn(),
    removeProductFromCart: jest.fn(),
    checkoutCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compile();

    cartController = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
  });

  describe('createCart', () => {
    it('should call cartService.createCart and return the result', async () => {
      const createCartDto: CreateCartDto = { products: [{ productId: 1, quantity: 1 }] };
      const result = { id: 1, cartProducts: [] };
      mockCartService.createCart.mockResolvedValue(result);

      expect(await cartController.createCart(createCartDto)).toEqual(result);
      expect(mockCartService.createCart).toHaveBeenCalledWith(createCartDto);
    });
  });

  describe('addProductToCart', () => {
    it('should call cartService.addProductToCart and return the result', async () => {
      const id = 1;
      const addProductDto: AddProductToCartDto = { productId: 2 };
      const result = { id: 1, cartProducts: [] };
      mockCartService.addProductToCart.mockResolvedValue(result);

      expect(await cartController.addProductToCart(id, addProductDto)).toEqual(result);
      expect(mockCartService.addProductToCart).toHaveBeenCalledWith(id, addProductDto);
    });
  });

  describe('removeProductFromCart', () => {
    it('should call cartService.removeProductFromCart and return the result', async () => {
      const id = 1;
      const removeProductDto: RemoveProductFromCartDto = { productId: 2 };
      const result = { id: 1, cartProducts: [] };
      mockCartService.removeProductFromCart.mockResolvedValue(result);

      expect(await cartController.removeProductFromCart(id, removeProductDto)).toEqual(result);
      expect(mockCartService.removeProductFromCart).toHaveBeenCalledWith(id, removeProductDto.productId);
    });
  });

  describe('checkoutCart', () => {
    it('should call cartService.checkoutCart and return the result', async () => {
      const id = 1;
      const result = { id: 1, paymentStatus: 'PAID', paymentDate: new Date() };
      mockCartService.checkoutCart.mockResolvedValue(result);

      expect(await cartController.checkoutCart(id)).toEqual(result);
      expect(mockCartService.checkoutCart).toHaveBeenCalledWith(id);
    });
  });
});
