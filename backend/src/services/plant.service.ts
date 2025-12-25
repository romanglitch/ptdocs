import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Plant} from '../entities/plant.entity';
import {CreatePlantDto} from '../dto/create-plant.dto';

@Injectable()
export class PlantService {
    constructor(
        @InjectRepository(Plant)
        private plantRepository: Repository<Plant>
    ) {}

    async create(createPlantDto: CreatePlantDto): Promise<Plant> {
        const plant = this.plantRepository.create(createPlantDto);
        return this.plantRepository.save(plant);
    }

    async findAll(includeArchived: boolean = false, categoryId:any): Promise<Plant[]> {
        if (includeArchived) {
            return await this.plantRepository.find({
                where: { categoryId: categoryId },
                relations: ['category', 'weeks', 'weeks.days'],
                order: {
                    updatedAt: 'ASC',
                    weeks: {
                        createdAt: 'ASC',
                        days: {
                            createdAt: 'ASC',
                        }
                    }
                },
            });
        }

        return await this.plantRepository.find({
            where: { archive: false, categoryId: categoryId },
            relations: ['category', 'weeks', 'weeks.days', 'weeks.days.tags'],
            order: {
                updatedAt: 'ASC',
                weeks: {
                    createdAt: 'ASC',
                    days: {
                        createdAt: 'ASC',
                    }
                }
            },
        });
    }

    async findOne(id: number): Promise<Plant> {
        const plant = await this.plantRepository.findOne({
            where: { id },
            relations: ['category', 'weeks', 'weeks.days', 'weeks.days.tags'],
            order: {
                weeks: {
                    createdAt: 'ASC',
                    days: {
                        createdAt: 'ASC',
                    }
                }
            },
        });

        if (!plant) {
            throw new NotFoundException(`Растение с ID ${id} не найдено`);
        }

        return plant;
    }

    async update(id: number, updateData: Partial<CreatePlantDto>): Promise<Plant> {
        const plant = await this.plantRepository.findOne({ where: { id } });

        if (!plant) {
            throw new NotFoundException(`Растение с ID ${id} не найдено`);
        }

        await this.plantRepository.update(id, updateData);
        return this.findOne(id);
    }

    async archive(id: number): Promise<Plant> {
        const plant = await this.findOne(id);
        plant.archive = true;
        return await this.plantRepository.save(plant);
    }

    async unarchive(id: number): Promise<Plant> {
        const plant = await this.findOne(id);
        plant.archive = false;
        return await this.plantRepository.save(plant);
    }

    async remove(id: number): Promise<void> {
        const plant = await this.plantRepository.findOne({ where: { id } });

        if (!plant) {
            throw new NotFoundException(`Растение с ID ${id} не найдено`);
        }

        await this.plantRepository.delete(id);
    }
}