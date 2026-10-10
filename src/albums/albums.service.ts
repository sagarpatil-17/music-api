
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAlbumDto) {
    return this.prisma.album.create({
      data: {
        ...dto,
        releaseDate: dto.releaseDate
          ? new Date(dto.releaseDate)
          : undefined,
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
        ...dto,
        releaseDate: dto.releaseDate
          ? new Date(dto.releaseDate)
          : undefined,
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
