import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
import {Day} from "../entities/day.entity";

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) {}

    async create(createTagDto: CreateTagDto): Promise<Tag> {
        const tag = this.tagRepository.create(createTagDto);
        return this.tagRepository.save(tag);
    }

    private async processImageToWebP(
        file: Express.Multer.File,
    ): Promise<string> {
        try {
            const originalPath = file.path; // 'uploads/tags/randomname.jpg'

            // 1. Формируем новое имя файла (заменяем .jpg/.png на .webp)
            const baseFilename = path.basename(
                originalPath,
                path.extname(originalPath),
            );
            const newWebPPath = path.join(file.destination, `${baseFilename}.webp`);

            // 2. Обработка с помощью sharp
            await sharp(originalPath)
                .resize(64)
                .webp({ quality: 80 }) // Сжатие и конвертация в WebP с качеством 80
                .toFile(newWebPPath);

            // 3. Удаляем оригинальный файл (.jpg/.png)
            await fs.unlink(originalPath);

            // 4. Возвращаем URL для нового .webp файла
            return `/uploads/tags/${path.basename(newWebPPath)}`;

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

    private async deleteIconFromDiskByUrl(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            // fileUrl = /uploads/tags/filename.webp
            const filename = path.basename(fileUrl);
            const projectRoot = path.resolve(process.cwd());
            const filePath = path.join(projectRoot, 'uploads/tags', filename);

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
    async updateTagIcon(id: number, files) {
        const tag = await this.tagRepository.findOneBy({ id });
        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        try {
            if (files) {
                await this.deleteIconFromDiskByUrl(tag.iconUrl);

                // 2. Загрузить и обработать новый файл
                tag.iconUrl = await this.processImageToWebP(files.icon);
            }
        } catch (error) {
            throw new InternalServerErrorException(
                `Ошибка во время обработки изображений: ${error.message}`,
            );
        }

        return this.tagRepository.save(tag);
    }

    async deleteTagIcon(id: number): Promise<Tag> {
        const tag = await this.tagRepository.findOneBy({ id });

        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        const currentUrl = tag.iconUrl;

        if (!currentUrl) {
            return tag;
        }

        // 1. Удаляем файл с диска, используя новый helper
        await this.deleteIconFromDiskByUrl(currentUrl);

        // 2. Очищаем URL в базе данных
        (tag.iconUrl as string | null) = null;

        return this.tagRepository.save(tag);
    }

    async findAll(): Promise<Tag[]> {
        return this.tagRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<Tag> {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) {
            throw new NotFoundException(`Тег с ID ${id} не найден`);
        }
        return tag;
    }

    async update(id: number, updateData: Partial<CreateTagDto>): Promise<Tag> {
        const tag = await this.tagRepository.findOne({ where: { id } });
        if (!tag) {
            throw new NotFoundException(`Тег с ID ${id} не найден`);
        }
        await this.tagRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const tag = await this.tagRepository.findOne({
            where: { id },
            relations: ['days']
        });
        if (!tag) {
            throw new NotFoundException(`Тег с ID ${id} не найден`);
        }

        if (tag.days && tag.days.length) {
            const dayIds:number[] = tag.days.map(day => day.id)
            await this.tagRepository.createQueryBuilder().relation(Tag, 'days').of(id).remove(dayIds);
        }

        if (tag.iconUrl) {
            await this.deleteIconFromDiskByUrl(tag.iconUrl);
        }

        await this.tagRepository.delete(id);
    }
}