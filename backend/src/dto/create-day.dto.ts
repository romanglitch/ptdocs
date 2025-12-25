import {IsNumber, IsOptional, IsArray, Min, Max, IsBoolean} from 'class-validator';

export class CreateDayDto {
    @IsNumber()
    weekId: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    humidity: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    tagIds?: number[];

    @IsBoolean()
    @IsOptional()
    closed?: boolean;
}

export class CreateMultipleDaysDto {
    @IsNumber()
    weekId: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    humidity: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    tagIds?: number[];

    @IsNumber()
    @Min(1)
    @Max(31)
    daysCount: number;

    @IsBoolean()
    @IsOptional()
    closed?: boolean;
}