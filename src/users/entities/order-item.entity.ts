import {
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	CreateDateColumn,
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity({ name: 'orders_items' })
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		name: 'create_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createAt: Date;

	@UpdateDateColumn({
		name: 'update_at',
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updateAt: Date;

	@Column({ type: 'int' })
	quantity: number;

	@ManyToOne(() => Product)
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@ManyToOne(() => Order, (order) => order.items)
	@JoinColumn({ name: 'order_id' })
	order: Order;
}
