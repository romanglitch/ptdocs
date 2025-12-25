import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseInterceptors,
    UploadedFile,
    BadRequestException, Query, ParseIntPipe, Patch
} from '@nestjs/common';
import { PlantService } from '../services/plant.service';
import { CreatePlantDto } from '../dto/create-plant.dto';

@Controller('plants')
export class PlantController {
    constructor(private readonly plantService: PlantService) {}

    @Post()
    create(@Body() createPlantDto: CreatePlantDto) {
        return this.plantService.create(createPlantDto);
    }

    @Get()
    findAll(@Query('includeArchived') includeArchived?: string, @Query('categoryId') categoryId?: number) {
        const includeArchivedBool = includeArchived === 'true';
        return this.plantService.findAll(includeArchivedBool, categoryId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.plantService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreatePlantDto>) {
        return this.plantService.update(+id, updateData);
    }

    @Patch(':id/archive')
    archive(@Param('id', ParseIntPipe) id: number) {
        return this.plantService.archive(id);
    }

    @Patch(':id/unarchive')
    unarchive(@Param('id', ParseIntPipe) id: number) {
        return this.plantService.unarchive(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.plantService.remove(+id);
    }
}