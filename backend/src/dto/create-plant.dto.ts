import {IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDate} from 'class-validator';
import {CreateDateColumn} from "typeorm";

export class CreatePlantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @CreateDateColumn()
    @IsOptional()
    startDate: Date;

    @IsNumber()
    categoryId: number;

    @IsBoolean()
    @IsOptional()
    archive?: boolean;
}