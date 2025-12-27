import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    BadRequestException,
    UseInterceptors,
    Patch,
    UploadedFiles,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { DayService } from '../services/day.service';
import { CreateDayDto, CreateMultipleDaysDto } from '../dto/create-day.dto';
import { diskStorage } from "multer";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller('days')
export class DayController {
    constructor(private readonly dayService: DayService) {}

    @Post()
    create(
        @Body() createDayDto: CreateDayDto,
        @Query('daysCount') daysCount?: string
    ) {
        if (daysCount) {
            const count = parseInt(daysCount, 10);
            if (isNaN(count) || count < 1 || count > 31) {
                throw new BadRequestException('daysCount должен быть числом от 1 до 31');
            }

            const createMultipleDaysDto: CreateMultipleDaysDto = {
                ...createDayDto,
                daysCount: count
            };

            return this.dayService.createMultiple(createMultipleDaysDto);
        }

        return this.dayService.create(createDayDto);
    }

    @Post('multiple')
    createMultiple(@Body() createMultipleDaysDto: CreateMultipleDaysDto) {
        return this.dayService.createMultiple(createMultipleDaysDto);
    }

    @Patch(':id/upload-stages')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'stage1', maxCount: 1 },
                { name: 'stage2', maxCount: 1 },
                { name: 'stage3', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/days',
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
    async uploadStagePhotos(
        @Param('id') id: number,
        @UploadedFiles() files: {
            stage1?: Express.Multer.File[],
            stage2?: Express.Multer.File[],
            stage3?: Express.Multer.File[],
        },
    ) {
        return this.dayService.updateStagePhotos(
            id,
            {
                stage1: files.stage1 ? files.stage1[0] : undefined,
                stage2: files.stage2 ? files.stage2[0] : undefined,
                stage3: files.stage3 ? files.stage3[0] : undefined,
            }
        );
    }

    @Delete(':id/photo/:stage')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePhoto(
        @Param('id') id: number,
        @Param('stage') stage: string,
    ) {
        const stageNum = parseInt(stage, 10);

        if (stageNum !== 1 && stageNum !== 2 && stageNum !== 3) {
            throw new BadRequestException('Stage parameter must be 1, 2, or 3.');
        }

        await this.dayService.deleteStagePhoto(id, stageNum as 1 | 2 | 3);
    }

    @Get()
    findAll() {
        return this.dayService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.dayService.findOne(+id);
    }

    @Get('week/:weekId')
    findByWeek(@Param('weekId') weekId: string) {
        return this.dayService.findByWeek(+weekId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreateDayDto>) {
        return this.dayService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.dayService.remove(+id);
    }
}