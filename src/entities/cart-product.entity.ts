import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;
}
