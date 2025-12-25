import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { WeekService } from '../services/week.service';
import { CreateWeekDto } from '../dto/create-week.dto';

@Controller('weeks')
export class WeekController {
    constructor(private readonly weekService: WeekService) {}

    @Post()
    create(@Body() createWeekDto: CreateWeekDto) {
        return this.weekService.create(createWeekDto);
    }

    @Get()
    findAll() {
        return this.weekService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.weekService.findOne(+id);
    }

    @Get('plant/:plantId')
    findByPlant(@Param('plantId') plantId: string) {
        return this.weekService.findByPlant(+plantId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<CreateWeekDto>) {
        return this.weekService.update(+id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.weekService.remove(+id);
    }
}