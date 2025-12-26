import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import {Plant} from "../entities/plant.entity";
import { CreateCategoryDto } from '../dto/create-category.dto';
import {Tag} from "../entities/tag.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Plant)
        private plantRepository: Repository<Plant>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            relations: ['plants'],
        });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['plants'],
        });

        if (!category) {
            throw new NotFoundException(`Категория с ID ${id} не найдена`);
        }

        return category;
    }

    async update(id: number, updateData: Partial<CreateCategoryDto>): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException(`Категория с ID ${id} не найдена`);
        }

        await this.categoryRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['plants'],
        });

        if (!category) {
            throw new NotFoundException(`Категория с ID ${id} не найдена`);
        }

        if (category.plants && category.plants.length) {
            const plantIds:number[] = category.plants.map(plant => plant.id)

            await this.categoryRepository
                .createQueryBuilder()
                .relation(Category, 'plants')
                .of(id)
                .remove(plantIds);
        }

        await this.categoryRepository.delete(id);
    }
}