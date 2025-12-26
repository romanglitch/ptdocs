import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete
} from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import {WeekNameService} from "../services/weekname.service";
import {CreateWeekNameDto} from "../dto/create-weekname.dto";

@Controller('weeknames')
export class WeekNameController {
    constructor(private readonly weekNameService: WeekNameService) {}

    @Post()
    create(@Body() createWeekNameDto: CreateWeekNameDto) {
        return this.weekNameService.create(createWeekNameDto);
    }

    @Get()
    findAll() {
        return this.weekNameService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.weekNameService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreateTagDto>) {
        return this.weekNameService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.weekNameService.remove(+id);
    }
}