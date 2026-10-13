
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albums: AlbumsService) {}

  // Public: albums available to regular users.
  @Get()
  @ApiOperation({ summary: 'Get published albums' })
  findAll() {
    return this.albums.findAll();
  }

  // Admin: all albums, including albums with draft songs.
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all albums for admin' })
  findAllForAdmin() {
    return this.albums.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album details' })
  findOne(@Param('id') id: string) {
    return this.albums.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateAlbumDto,
    @Req() req: Request & {
      user?: { id?: string; sub?: string };
    },
  ) {
    const userId = req.user?.id ?? req.user?.sub;
    return this.albums.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return this.albums.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.albums.remove(id);
  }
}
