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

// Интерфейс для удобства
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
        private weekRepository: Repository<Week>,
        @InjectRepository(Plant)
        private plantRepository: Repository<Plant>
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

        // Проверяем существование недели
        const week = await this.weekRepository.findOne({
            where: { id: baseDayData.weekId },
            relations: ['days'],
        });
        if (!week) {
            throw new NotFoundException(`Неделя с ID ${baseDayData.weekId} не найдена`);
        }

        // Получаем теги если они указаны
        let tags: Tag[] = [];
        if (tagIds && tagIds.length > 0) {
            tags = await this.tagRepository.find({
                where: { id: In(tagIds) }
            });
        }

        // Создаем массив дней
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

        // Сохраняем все дни одной транзакцией
        return this.dayRepository.save(daysToCreate);
    }

    private async processImageToWebP(
        file: Express.Multer.File,
    ): Promise<string> {
        try {
            const originalPath = file.path; // 'uploads/days/randomname.jpg'

            // 1. Формируем новое имя файла (заменяем .jpg/.png на .webp)
            const baseFilename = path.basename(
                originalPath,
                path.extname(originalPath),
            );
            const newWebPPath = path.join(file.destination, `${baseFilename}.webp`);

            // 2. Обработка с помощью sharp
            await sharp(originalPath)
                .rotate()
                .resize(1920)
                .webp({ quality: 80 }) // Сжатие и конвертация в WebP с качеством 80
                .toFile(newWebPPath);

            // 3. Удаляем оригинальный файл (.jpg/.png)
            await fs.unlink(originalPath);

            // 4. Возвращаем URL для нового .webp файла
            return `/uploads/days/${path.basename(newWebPPath)}`;

        } catch (error) {
            // Если что-то пошло не так, удаляем оригинал, чтобы не мусорить
            try {
                await fs.unlink(file.path);
            } catch (e) {
                // Игнорируем ошибку, если файл уже удален
            }
            throw new InternalServerErrorException(
                `Ошибка обработки файла ${file.originalname}: ${error.message}`,
            );
        }
    }

    private async deleteFileFromDiskByUrl(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            // fileUrl = /uploads/filename.webp
            const filename = path.basename(fileUrl);
            const projectRoot = path.resolve(process.cwd());
            const filePath = path.join(projectRoot, 'uploads/days', filename);

            await fs.unlink(filePath);

        } catch (error) {
            // Игнорируем ошибку 'файл не найден' (ENOENT)
            if (error.code !== 'ENOENT') {
                console.error(`Ошибка при удалении старого файла ${fileUrl}:`, error);
                // Можно проигнорировать, чтобы не блокировать загрузку нового фото
            }
        }
    }

    // ✅ ОБНОВЛЕННЫЙ МЕТОД: updateStagePhotos
    async updateStagePhotos(id: number, files: StagePhotoFiles) {
        const day = await this.dayRepository.findOneBy({ id });
        if (!day) {
            throw new NotFoundException(`Day with ID ${id} not found`);
        }

        try {
            // --- Обработка Stage 1 ---
            if (files.stage1) {
                // 1. УДАЛИТЬ старый файл, если он есть
                await this.deleteFileFromDiskByUrl(day.stage1PhotoUrl);

                // 2. Загрузить и обработать новый файл
                day.stage1PhotoUrl = await this.processImageToWebP(files.stage1);
            }

            // --- Обработка Stage 2 ---
            if (files.stage2) {
                // 1. УДАЛИТЬ старый файл, если он есть
                await this.deleteFileFromDiskByUrl(day.stage2PhotoUrl);

                // 2. Загрузить и обработать новый файл
                day.stage2PhotoUrl = await this.processImageToWebP(files.stage2);
            }

            // --- Обработка Stage 3 ---
            if (files.stage3) {
                // 1. УДАЛИТЬ старый файл, если он есть
                await this.deleteFileFromDiskByUrl(day.stage3PhotoUrl);

                // 2. Загрузить и обработать новый файл
                day.stage3PhotoUrl = await this.processImageToWebP(files.stage3);
            }
        } catch (error) {
            throw new InternalServerErrorException(
                `Ошибка во время обработки изображений: ${error.message}`,
            );
        }

        return this.dayRepository.save(day);
    }

    // 🔄 ОБНОВЛЕННЫЙ МЕТОД: deleteStagePhoto (использует новый helper)
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

        // 1. Удаляем файл с диска, используя новый helper
        await this.deleteFileFromDiskByUrl(currentUrl);

        // 2. Очищаем URL в базе данных
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