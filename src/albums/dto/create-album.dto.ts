
import {
    IsDateString,
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
    @IsString()
    @MinLength(1)
    @ApiProperty()
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;
}
