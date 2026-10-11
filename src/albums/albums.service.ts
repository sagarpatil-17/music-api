
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateAlbumDto, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException(
        'Authenticated user ID not found',
      );
    }

    return this.prisma.album.create({
      data: {
        ...dto,
        created_by: userId,
      },
    });
  }

  findAll() {
    return this.prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        songs: {
          where: { status: 'PUBLISHED' },
        },
      },
    });
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        songs: {
          where: { status: 'PUBLISHED' },
        },
      },
    });

    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async update(id: string, dto: UpdateAlbumDto) {
    await this.findOne(id);

    return this.prisma.album.update({
      where: { id },
      data: {
        ...dto
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Keep the album record so existing song references remain valid.
    return this.prisma.album.update({
      where: { id },
      data: { title: '[Archived] ' + id },
    });
  }
}
