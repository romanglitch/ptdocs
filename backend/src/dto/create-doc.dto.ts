import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    content?: any;
}