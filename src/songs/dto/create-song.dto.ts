
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsInt,
    IsMongoId,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

export class CreateSongDto {
    @IsString()
    @MinLength(1)
    @ApiProperty()
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @ApiProperty()
    artists: string[];

    @IsString()
    @MinLength(1)
    @ApiProperty()
    audioPath: string;

    @IsInt()
    @Min(1)
    @ApiProperty()
    durationSeconds: number;

    @IsOptional()
    @IsMongoId()
    @ApiProperty()
    albumId?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty()
    releaseDate?: string;
}
