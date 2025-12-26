import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Week } from '../entities/week.entity';
import { CreateWeekDto } from '../dto/create-week.dto';
import { Day } from "../entities/day.entity";
import {DayService} from "../services/day.service";

@Injectable()
export class WeekService {
    constructor(
        @InjectRepository(Week)
        private weekRepository: Repository<Week>,
        @InjectRepository(Day)
        private dayRepository: Repository<Day>,
    ) {}

    async create(createWeekDto: CreateWeekDto): Promise<Week> {
        const plantId:number = createWeekDto.plantId
        const plantWeeks:Week[] = await this.weekRepository.find({
            where: { plantId },
            order: {
                createdAt: 'ASC',
            },
        })

        let week:any = null

        if (plantWeeks.length < 8) {
            week = this.weekRepository.create(createWeekDto);
        } else {
            throw new BadRequestException(`Больше недель добавить нельзя`);
        }

        return this.weekRepository.save(week);
    }

    async findAll(): Promise<Week[]> {
        return this.weekRepository.find({
            order: {
                createdAt: 'ASC',
                days: {
                    createdAt: 'ASC'
                }
            },
            relations: ['days', 'days.tags']
        });
    }

    async findOne(id: number): Promise<Week> {
        const week = await this.weekRepository.findOne({
            where: { id },
            order: {
                days: {
                    createdAt: 'ASC'
                }
            },
            relations: ['days', 'days.tags'],
        });
        if (!week) {
            throw new NotFoundException(`Неделя с ID ${id} не найдена`);
        }

        return week;
    }

    async findByPlant(plantId: number): Promise<Week[]> {
        return this.weekRepository.find({
            where: { plantId },
            order: {
                createdAt: 'ASC',
                days: {
                    createdAt: 'ASC'
                }
            },
            relations: ['days', 'days.tags']
        });
    }

    async update(id: number, updateData: Partial<CreateWeekDto>): Promise<Week> {
        const week = await this.weekRepository.findOne({
            where: { id },
            order: {
                days: {
                    createdAt: 'ASC'
                }
            },
            relations: ['days', 'days.tags']
        });
        if (!week) {
            throw new NotFoundException(`Неделя с ID ${id} не найдена`);
        }

        await this.weekRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const week = await this.weekRepository.findOne({
            where: { id },
            order: {
                days: {
                    createdAt: 'ASC'
                }
            },
            relations: ['days', 'days.tags']
        });
        if (!week) {
            throw new NotFoundException(`Неделя с ID ${id} не найдена`);
        }

        await this.weekRepository.delete(id);
    }
}