import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import config from './config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: enviroments[process.env.NODE_ENV] || '.env',
			load: [config],
			isGlobal: true,
			validationSchema: Joi.object({
				API_KEY: Joi.number().required(),
				DATABASE_NAME: Joi.string().required(),
				DATABASE_PORT: Joi.number().required(),
				POSTGRES_DB: Joi.string().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required(),
				POSTGRES_HOST: Joi.string().hostname().required(),
			}),
		}),
		HttpModule,
		UsersModule,
		ProductsModule,
		DatabaseModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: 'TASKS',
			useFactory: async (http: HttpService) => {
				const response = http.get(
					'https://jsonplaceholder.typicode.com/todos',
				);
				const tasks = await firstValueFrom(response);
				return tasks.data;
			},
			inject: [HttpService],
		},
	],
})
export class AppModule {}
