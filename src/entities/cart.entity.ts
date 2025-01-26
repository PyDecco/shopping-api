import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, Column } from 'typeorm';
import { CartProduct } from './cart-product.entity';
import { Order } from './order.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, { cascade: true, eager: true })
  cartProducts: CartProduct[];
  
  @OneToOne(() => Order, (order) => order.cart, { nullable: true })
  @JoinColumn()
  order: Order;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentStatus: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;
}
