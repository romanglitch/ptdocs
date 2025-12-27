import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Not, Repository} from 'typeorm';
import {Day} from '../entities/day.entity';
import {Tag} from '../entities/tag.entity';
import {Week} from '../entities/week.entity';
import {CreateDayDto, CreateMultipleDaysDto} from '../dto/create-day.dto';
import {Plant} from "../entities/plant.entity";

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface StagePhotoFiles {
    stage1?: Express.Multer.File;
    stage2?: Express.Multer.File;
    stage3?: Express.Multer.File;
}

@Injectable()
export class DayService {
    constructor(
        @InjectRepository(Day)
        private dayRepository: Repository<Day>,
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
        @InjectRepository(Week)
        private weekRepository: Repository<Week>
    ) {}

    async create(createDayDto: CreateDayDto): Promise<Day> {
        const { tagIds, ...dayData } = createDayDto;

        // Проверяем существование недели
        const week = await this.weekRepository.findOne({
            where: { id: dayData.weekId }
        });
        if (!week) {
            throw new NotFoundException(`Неделя с ID ${dayData.weekId} не найдена`);
        }

        const day = this.dayRepository.create(dayData);

        if (tagIds && tagIds.length > 0) {
            day.tags = await this.tagRepository.find({
                where: {id: In(tagIds)}
            });
        }

        return this.dayRepository.save(day);
    }

    async createMultiple(createMultipleDaysDto: CreateMultipleDaysDto): Promise<Day[]> {
        const { daysCount, tagIds, ...baseDayData } = createMultipleDaysDto;

        const week = await this.weekRepository.findOne({
            where: { id: baseDayData.weekId },
            relations: ['days'],
        });
        if (!week) {
            throw new NotFoundException(`Неделя с ID ${baseDayData.weekId} не найдена`);
        }

        let tags: Tag[] = [];
        if (tagIds && tagIds.length > 0) {
            tags = await this.tagRepository.find({
                where: { id: In(tagIds) }
            });
        }

        const daysToCreate: Day[] = [];
        for (let i = 0; i < daysCount; i++) {
            const dayData = {
                ...baseDayData
            };

            const day = this.dayRepository.create(dayData);

            const nowCreatedAt = new Date();
            nowCreatedAt.setMinutes(nowCreatedAt.getMinutes() + i);

            day.createdAt = nowCreatedAt;
            day.updatedAt = nowCreatedAt;

            if (tags.length > 0) {
                day.tags = tags;
            }

            daysToCreate.push(day);
        }

        return this.dayRepository.save(daysToCreate);
    }

    private async processImageToWebP(
        file: Express.Multer.File,
    ): Promise<string> {
        try {
            const originalPath = file.path; // 'uploads/days/randomname.jpg'

            const baseFilename = path.basename(
                originalPath,
                path.extname(originalPath),
            );
            const newWebPPath = path.join(file.destination, `${baseFilename}.webp`);

            await sharp(originalPath)
                .rotate()
                .resize(1920)
                .webp({ quality: 80 })
                .toFile(newWebPPath);

            await fs.unlink(originalPath);

            return `/uploads/days/${path.basename(newWebPPath)}`;

        } catch (error) {
            try {
                await fs.unlink(file.path);
            } catch (e) {
                //
            }
            throw new InternalServerErrorException(
                `Ошибка обработки файла ${file.originalname}: ${error.message}`,
            );
        }
    }

    private async deleteFileFromDiskByUrl(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            // fileUrl = /uploads/days/filename.webp
            const filename = path.basename(fileUrl);
            const projectRoot = path.resolve(process.cwd());
            const filePath = path.join(projectRoot, 'uploads/days', filename);

            await fs.unlink(filePath);

        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Ошибка при удалении старого файла ${fileUrl}:`, error);
            }
        }
    }

    async updateStagePhotos(id: number, files: StagePhotoFiles) {
        const day = await this.dayRepository.findOneBy({ id });
        if (!day) {
            throw new NotFoundException(`Day with ID ${id} not found`);
        }

        try {
            if (files.stage1) {
                await this.deleteFileFromDiskByUrl(day.stage1PhotoUrl);
                day.stage1PhotoUrl = await this.processImageToWebP(files.stage1);
            }

            if (files.stage2) {
                await this.deleteFileFromDiskByUrl(day.stage2PhotoUrl);
                day.stage2PhotoUrl = await this.processImageToWebP(files.stage2);
            }

            if (files.stage3) {
                await this.deleteFileFromDiskByUrl(day.stage3PhotoUrl);
                day.stage3PhotoUrl = await this.processImageToWebP(files.stage3);
            }
        } catch (error) {
            throw new InternalServerErrorException(
                `Ошибка во время обработки изображений: ${error.message}`,
            );
        }

        return this.dayRepository.save(day);
    }

    async deleteStagePhoto(id: number, stage: 1 | 2 | 3): Promise<Day> {
        const day = await this.dayRepository.findOneBy({ id });

        if (!day) {
            throw new NotFoundException(`Day with ID ${id} not found`);
        }

        const photoUrlKey = `stage${stage}PhotoUrl` as keyof Day;
        const currentUrl = day[photoUrlKey] as string;

        if (!currentUrl) {
            return day;
        }

        await this.deleteFileFromDiskByUrl(currentUrl);

        (day[photoUrlKey] as string | null) = null;

        return this.dayRepository.save(day);
    }

    async findAll(): Promise<Day[]> {
        return this.dayRepository.find({
            order: {
                createdAt: 'ASC'
            },
            relations: ['tags'],
        });
    }

    async findOne(id: number): Promise<Day> {
        const day = await this.dayRepository.findOne({
            where: { id },
            relations: ['tags'],
        });
        if (!day) {
            throw new NotFoundException(`День с ID ${id} не найден`);
        }
        return day;
    }

    async findByWeek(weekId: number): Promise<Day[]> {
        return this.dayRepository.find({
            order: {
                createdAt: 'ASC'
            },
            where: { weekId },
            relations: ['tags'],
        });
    }

    async update(id: number, updateData: Partial<CreateDayDto>): Promise<Day> {
        const { tagIds, ...dayUpdateData } = updateData;
        const day = await this.dayRepository.findOne({
            where: { id },
            relations: ['tags']
        });

        if (!day) {
            throw new NotFoundException(`День с ID ${id} не найден`);
        }

        if (tagIds !== undefined) {
            if (tagIds.length > 0) {
                day.tags = await this.tagRepository.find({
                    where: {id: In(tagIds)}
                });
            } else {
                day.tags = [];
            }
        }

        Object.assign(day, dayUpdateData);
        await this.dayRepository.save(day);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const day = await this.dayRepository.findOne({ where: { id } });
        if (!day) {
            throw new NotFoundException(`День с ID ${id} не найден`);
        }

        await this.deleteStagePhoto(id, 1)

        await this.dayRepository.delete(id);
    }
}