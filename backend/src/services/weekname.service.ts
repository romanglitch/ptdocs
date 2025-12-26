import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {WeekName} from "../entities/weekname.entity";
import {CreateWeekNameDto} from "../dto/create-weekname.dto";

@Injectable()
export class WeekNameService {
    constructor(
        @InjectRepository(WeekName)
        private weeknameRepository: Repository<WeekName>,
    ) {}

    async create(createWeekNameDto: CreateWeekNameDto): Promise<WeekName> {
        const weekname = this.weeknameRepository.create(createWeekNameDto);
        return this.weeknameRepository.save(weekname);
    }

    async findAll(): Promise<WeekName[]> {
        return this.weeknameRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<WeekName> {
        const weekname = await this.weeknameRepository.findOne({ where: { id } });
        if (!weekname) {
            throw new NotFoundException(`Название недели с ID ${id} не найдено`);
        }
        return weekname;
    }

    async update(id: number, updateData: Partial<CreateWeekNameDto>): Promise<WeekName> {
        const weekname = await this.weeknameRepository.findOne({ where: { id } });
        if (!weekname) {
            throw new NotFoundException(`Название недели с ID ${id} не найдено`);
        }
        await this.weeknameRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const weekname = await this.weeknameRepository.findOne({
            where: { id }
        });
        if (!weekname) {
            throw new NotFoundException(`Название недели с ID ${id} не найдено`);
        }

        await this.weeknameRepository.delete(id);
    }
}