import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255 })
	email: string;

	@Column({ type: 'varchar', length: 255 })
	password: string; // encript

	@Column({ type: 'varchar', length: 100 })
	role: string;
}
