import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWeekNameDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}