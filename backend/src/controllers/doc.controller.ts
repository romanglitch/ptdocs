import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    UseInterceptors,
    UploadedFiles,
    HttpCode, HttpStatus, BadRequestException
} from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {DocService} from "../services/doc.service";
import {CreateDocDto} from "../dto/create-doc.dto";

@Controller('docs')
export class DocController {
    constructor(private readonly docService: DocService) {}

    @Post()
    create(@Body() createDocDto: CreateDocDto) {
        return this.docService.create(createDocDto);
    }

    @Patch('/upload-image')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/docs',
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        return cb(null, randomName);
                    },
                }),
            },
        ),
    )
    async uploadDocImage(
        @UploadedFiles() files: {
            image?: Express.Multer.File[]
        },
    ) {
        return this.docService.uploadDocImage(
            {
                image: files.image ? files.image[0] : undefined
            }
        );
    }

    @Delete('/delete-image')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePhoto(
        @Body() updateData: {
            url: string
        }
    ) {
        await this.docService.deleteDocImage(updateData.url);
    }

    @Get()
    findAll() {
        return this.docService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.docService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreateDocDto>) {
        return this.docService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.docService.remove(+id);
    }
}