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
    HttpCode, HttpStatus
} from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Post()
    create(@Body() createTagDto: CreateTagDto) {
        return this.tagService.create(createTagDto);
    }

    @Patch(':id/upload-icon')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'icon', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/tags',
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
    async uploadTagIcon(
        @Param('id') id: number,
        @UploadedFiles() files: {
            icon?: Express.Multer.File[]
        },
    ) {
        return this.tagService.updateTagIcon(
            id,
            {
                icon: files.icon ? files.icon[0] : undefined
            }
        );
    }

    @Delete(':id/icon')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePhoto(
        @Param('id') id: number
    ) {
        await this.tagService.deleteTagIcon(id);
    }

    @Get()
    findAll() {
        return this.tagService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreateTagDto>) {
        return this.tagService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tagService.remove(+id);
    }
}