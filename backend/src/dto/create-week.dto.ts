import {IsNumber, IsNotEmpty, IsOptional, IsString, Min} from 'class-validator';

export class CreateWeekDto {
    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    plantId: number;
}