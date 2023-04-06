import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dto';

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private productRepo: Repository<Product>,
		@InjectRepository(Brand)
		private brandRepo: Repository<Brand>,
		@InjectRepository(Category)
		private categoryRepo: Repository<Category>,
	) {}

	findAll() {
		return this.productRepo.find({
			relations: ['brand'],
		});
	}

	async findOne(id: number) {
		const product = await this.productRepo.findOne({
			relations: ['brand', 'categories'],
			where: {
				id,
			},
		});

		if (!product) {
			throw new NotFoundException(`Product #${id} not found`);
		}
		return product;
	}

	async create(data: CreateProductDto) {
		const newProduct = this.productRepo.create(data);
		if (data.brandId) {
			const brand = await this.brandRepo.findOneBy({ id: data.brandId });
			newProduct.brand = brand;
		}
		if (data.categoriesIds) {
			const categories = await this.categoryRepo.findBy({
				id: In(data.categoriesIds),
			});
			newProduct.categories = categories;
		}
		return this.productRepo.save(newProduct);
	}

	async update(id: number, changes: UpdateProductDto) {
		const product = await this.productRepo.findOneBy({ id });
		if (changes.brandId) {
			const brand = await this.brandRepo.findOneBy({
				id: changes.brandId,
			});
			product.brand = brand;
		}
		if (changes.categoriesIds) {
			const categories = await this.categoryRepo.findBy({
				id: In(changes.categoriesIds),
			});
			product.categories = categories;
		}
		this.productRepo.merge(product, changes);
		return this.productRepo.save(product);
	}

	async removeCategoryByProduct(productId: number, categoryId: number) {
		const product = await this.productRepo.findOne({
			relations: ['categories'],
			where: {
				id: productId,
			},
		});
		product.categories = product.categories.filter(
			(item) => item.id !== categoryId,
		);
		return this.productRepo.save(product);
	}

	async addCategoryToProduct(productId: number, categoryId: number) {
		const product = await this.productRepo.findOne({
			relations: ['categories'],
			where: {
				id: productId,
			},
		});
		const category = await this.categoryRepo.findOneBy({ id: categoryId });
		product.categories.push(category);
		return this.productRepo.save(product);
	}

	remove(id: number) {
		return this.productRepo.delete(id);
	}
}
