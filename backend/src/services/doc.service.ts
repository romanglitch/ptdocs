import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Doc} from "../entities/doc.entity";
import {CreateDocDto} from "../dto/create-doc.dto";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
import {Tag} from "../entities/tag.entity";

@Injectable()
export class DocService {
    constructor(
        @InjectRepository(Doc)
        private docRepository: Repository<Doc>,
    ) {}

    async create(createDocDto: CreateDocDto): Promise<Doc> {
        const doc = this.docRepository.create(createDocDto);
        return this.docRepository.save(doc);
    }

    private async processImageToWebP(
        file: Express.Multer.File,
    ): Promise<string> {
        try {
            const originalPath = file.path; // 'uploads/docs/randomname.jpg'

            // 1. Формируем новое имя файла (заменяем .jpg/.png на .webp)
            const baseFilename = path.basename(
                originalPath,
                path.extname(originalPath),
            );
            const newWebPPath = path.join(file.destination, `${baseFilename}.webp`);

            // 2. Обработка с помощью sharp
            await sharp(originalPath)
                .webp({ quality: 80 }) // Сжатие и конвертация в WebP с качеством 80
                .toFile(newWebPPath);

            // 3. Удаляем оригинальный файл (.jpg/.png)
            await fs.unlink(originalPath);

            // 4. Возвращаем URL для нового .webp файла
            return `/uploads/docs/${path.basename(newWebPPath)}`;

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

    private async deleteDocsImage(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            // fileUrl = /uploads/docs/filename.webp
            const filename = path.basename(fileUrl);
            const projectRoot = path.resolve(process.cwd());
            const filePath = path.join(projectRoot, 'uploads/docs', filename);

            await fs.unlink(filePath);

        } catch (error) {
            // Игнорируем ошибку 'файл не найден' (ENOENT)
            if (error.code !== 'ENOENT') {
                console.error(`Ошибка при удалении старого файла ${fileUrl}:`, error);
                // Можно проигнорировать, чтобы не блокировать загрузку нового фото
            }
        }
    }

    async uploadDocImage(files) {
        let uploadedUrl:any = null;

        try {
            if (files) {
                uploadedUrl = await this.processImageToWebP(files.image);
            }
        } catch (error) {
            throw new InternalServerErrorException(
                `Ошибка во время обработки изображений: ${error.message}`,
            );
        }

        return uploadedUrl;
    }

    async deleteDocImage(url:string): Promise<any> {
        if (!url) {
            return false;
        }

        await this.deleteDocsImage(url);

        return true
    }
    
    async findAll(): Promise<Doc[]> {
        return await this.docRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }

    async findOne(id: number): Promise<Doc> {
        const doc = await this.docRepository.findOne({ where: { id } });
        if (!doc) {
            throw new NotFoundException(`Документ с ID ${id} не найден`);
        }
        return doc;
    }

    async update(id: number, updateData: Partial<CreateDocDto>): Promise<Doc> {
        const doc = await this.docRepository.findOne({ where: { id } });
        if (!doc) {
            throw new NotFoundException(`Документ с ID ${id} не найден`);
        }

        if (doc.content) {
            doc.content.blocks.filter(block => block.type == 'image').forEach(imageBlock => {
                if (!updateData.content.blocks.find(block => block.id == imageBlock.id)) {
                    const deletedImageUrl = new URL(imageBlock.data.file.url);

                    this.deleteDocImage(deletedImageUrl.pathname)
                }
            })
        }

        await this.docRepository.update(id, updateData);

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const doc = await this.docRepository.findOne({
            where: { id }
        });

        if (!doc) {
            throw new NotFoundException(`Документ с ID ${id} не найден`);
        }

        if (doc.content && doc.content.blocks) {
            const imageBlocks = doc.content.blocks.filter(block => block.type == 'image')
            if (imageBlocks.length) {
                imageBlocks.forEach(imageBlock => {
                    const deletedImageUrl = new URL(imageBlock.data.file.url);
                    this.deleteDocImage(deletedImageUrl.pathname)
                })
            }
        }

        await this.docRepository.delete(id);
    }
}