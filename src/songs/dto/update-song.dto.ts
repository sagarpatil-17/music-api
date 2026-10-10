
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

export class UpdateSongDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @ApiProperty()
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ApiProperty()
    artists?: string[];

    @IsOptional()
    @IsMongoId()
    @ApiProperty()
    albumId?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty()
    releaseDate?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty()
    durationSeconds?: number;
}
