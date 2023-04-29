import {
	Controller,
	Get,
	Query,
	Param,
	Post,
	Body,
	Put,
	Delete,
	HttpStatus,
	HttpCode,
	Res,
	UseGuards,
	// ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import {
	CreateProductDto,
	UpdateProductDto,
	FilterProductsDto,
} from '../dtos/products.dto';
import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
	constructor(private productsService: ProductsService) {}

	@Public()
	@Get()
	@ApiOperation({ summary: 'List of products' })
	getProducts(@Query() params: FilterProductsDto) {
		return this.productsService.findAll(params);
	}

	@Public()
	@Get('filter')
	getProductFilter() {
		return `yo soy un filter`;
	}

	@Get(':productId')
	@HttpCode(HttpStatus.ACCEPTED)
	getOne(@Param('productId', ParseIntPipe) productId: number) {
		// response.status(200).send({
		//   message: `product ${productId}`,
		// });
		return this.productsService.findOne(productId);
	}

	@Post()
	create(@Body() payload: CreateProductDto) {
		return this.productsService.create(payload);
	}

	@Put(':id')
	update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
		return this.productsService.update(id, payload);
	}

	@Put(':id/category/:categoryId')
	addCategoryToProduct(
		@Param('id') id: number,
		@Param('categoryId', ParseIntPipe) categoryId: number,
	) {
		return this.productsService.addCategoryToProduct(id, categoryId);
	}

	@Delete(':id')
	delete(@Param('id') id: number) {
		return this.productsService.remove(id);
	}

	@Delete(':id/category/:categoryId')
	deleteCategory(
		@Param('id', ParseIntPipe) id: number,
		@Param('categoryId', ParseIntPipe) categoryId: number,
	) {
		return this.productsService.removeCategoryByProduct(id, categoryId);
	}
}
