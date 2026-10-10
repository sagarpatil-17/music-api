
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PlaylistVisibility } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaylistDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @ApiProperty()
    name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    coverImagePath?: string;

    @IsOptional()
    @IsEnum(PlaylistVisibility)
    @ApiProperty()
    visibility?: PlaylistVisibility;
}
