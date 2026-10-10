
import {
    IsDateString,
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { AlbumType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
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
    @IsMongoId()
    @ApiProperty()
    artistId?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    coverImagePath?: string;

    @IsOptional()
    @IsEnum(AlbumType)
    @ApiProperty()
    albumType?: AlbumType;

    @IsOptional()
    @IsDateString()
    @ApiProperty()
    releaseDate?: string;
}
