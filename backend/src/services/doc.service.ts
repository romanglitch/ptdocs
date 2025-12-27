import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Doc} from "../entities/doc.entity";
import {CreateDocDto} from "../dto/create-doc.dto";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

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

            const baseFilename = path.basename(
                originalPath,
                path.extname(originalPath),
            );
            const newWebPPath = path.join(file.destination, `${baseFilename}.webp`);

            await sharp(originalPath)
                .webp({ quality: 80 })
                .toFile(newWebPPath);

            await fs.unlink(originalPath);

            return `/uploads/docs/${path.basename(newWebPPath)}`;

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

    private async deleteDocsImage(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            // fileUrl = /uploads/docs/filename.webp
            const filename = path.basename(fileUrl);
            const projectRoot = path.resolve(process.cwd());
            const filePath = path.join(projectRoot, 'uploads/docs', filename);

            await fs.unlink(filePath);

        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Ошибка при удалении старого файла ${fileUrl}:`, error);
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