import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  createdAt: Date;

  @OneToOne(() => Cart, (cart) => cart.order, { cascade: true })
  @JoinColumn()
  cart: Cart;
}


