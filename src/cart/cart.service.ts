import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dtos/create-cart.dto';
import { AddProductToCartDto } from './dtos/add-product-to-cart.dto';
import { ProductService } from '../product/product.service';
import { CartProduct } from '../entities/cart-product.entity';
import { OrderService } from '../order/order.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  // Criar carrinho
  async createCart(dto: CreateCartDto): Promise<Cart> {
    const products = await this.validateAndFetchProducts(dto.products.map(p => p.productId));
    const cartProducts = this.createCartProducts(products);
    return this.createAndSaveCart(cartProducts);
  }

  private async validateAndFetchProducts(productIds: number[]): Promise<any[]> {
    const products = await this.productService.findMany(productIds);
    if (!products.length) {
      throw new NotFoundException('No valid products found');
    }
    return products;
  }

  private createCartProducts(products: any[]): CartProduct[] {
    const cartProduct = this.cartProductRepository.create({ quantity: 1, product: products[0] });
    return [cartProduct];
  }

  private async createAndSaveCart(cartProducts: CartProduct[]): Promise<Cart> {
    const cart = this.cartRepository.create({
      cartProducts,
      paymentStatus: 'OPEN',
      paymentDate: null,
    });
    return await this.cartRepository.save(cart);
  }

  // Adicionar produto ao carrinho
  async addProductToCart(cartId: number, dto: AddProductToCartDto): Promise<Cart> {
    const cart = await this.findCartById(cartId);
    const product = await this.validateAndFetchProduct(dto.productId);
    this.validateCartForCheckout(cart);

    const existingCartProduct = this.findCartProduct(cart, dto.productId);
    if (existingCartProduct) {
      await this.incrementCartProductQuantity(existingCartProduct);
    } else {
      await this.addNewCartProduct(cart, product);
    }

    return await this.reloadCart(cartId);
  }

  private async findCartById(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    return cart;
  }

  private async validateAndFetchProduct(productId: number): Promise<any> {
    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (product.stock === 0) {
      throw new BadRequestException(`Product with ID ${productId} is out of stock`);
    }
    return product;
  }

  private findCartProduct(cart: Cart, productId: number): CartProduct | undefined {
    return cart.cartProducts.find(cartProduct => cartProduct.product.id === productId);
  }

  private async incrementCartProductQuantity(cartProduct: CartProduct): Promise<void> {
    cartProduct.quantity += 1;
    await this.cartProductRepository.save(cartProduct);
  }

  private async addNewCartProduct(cart: Cart, product: any): Promise<void> {
    const newCartProduct = this.cartProductRepository.create({ cart, product, quantity: 1 });
    await this.cartProductRepository.save(newCartProduct);
  }

  private async reloadCart(cartId: number): Promise<Cart> {
    return this.findCartById(cartId);
  }

  async removeProductFromCart(cartId: number, productId: number): Promise<Cart> {
    const cart = await this.findCartById(cartId);
    const cartProduct = this.findCartProduct(cart, productId);
    this.validateCartForCheckout(cart);

    if (!cartProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found in the cart`);
    }

    if (cartProduct.quantity > 1) {
      await this.decrementCartProductQuantity(cartProduct);
    } else {
      await this.removeCartProduct(cartProduct);
    }

    return this.reloadCart(cartId);
  }

  private async decrementCartProductQuantity(cartProduct: CartProduct): Promise<void> {
    cartProduct.quantity -= 1;
    await this.cartProductRepository.save(cartProduct);
  }

  private async removeCartProduct(cartProduct: CartProduct): Promise<void> {
    await this.cartProductRepository.remove(cartProduct);
  }

  async checkoutCart(cartId: number): Promise<Cart> {
    const cart = await this.findCartById(cartId);
    this.validateCartForCheckout(cart);

    const total = this.calculateCartTotal(cart);

    cart.paymentStatus = 'PAID';
    cart.paymentDate = new Date();

    const order = await this.orderService.create({ 
      total, 
      cart, 
      createdAt: new Date(),
    });
    cart.order = order;

    return await this.cartRepository.save(cart);
  }

  private calculateCartTotal(cart: Cart): number {
    return cart.cartProducts.reduce((acc, item) => {
      const price = parseFloat(item.product.price.toString());
      return acc + price * item.quantity;
    }, 0);
  }

  private validateCartForCheckout(cart: Cart): void {
    if (cart.paymentStatus === 'PAID') {
      throw new BadRequestException('Cart is already paid');
    }
  }
}
