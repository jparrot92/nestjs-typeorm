import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'root',
	password: '123456',
	database: 'my_db',
	synchronize: false,
	logging: false,
	entities: ['src/**/*.entity.ts'],
	migrations: ['src/database/migrations/*.ts'],
	migrationsTableName: 'migrations',
});
