import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, Column } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product, { eager: true })
  @JoinTable()
  products: Product[];
  
  @OneToOne(() => Order, (order) => order.cart, { nullable: true })
  @JoinColumn()
  order: Order;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentStatus: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;
}
