
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SongStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) { }

  async create(dto: CreateAlbumDto, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException(
        'Authenticated user ID not found',
      );
    }

    const album = await this.prisma.album.create({
      data: {
        ...dto,
        created_by: userId,
      },
    });

    return this.withCoverUrl(album);
  }

  async findAll() {
    const albums = await this.prisma.album.findMany({
      where: {
        songs: {
          some: {
            status: SongStatus.PUBLISHED,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        songs: {
          where: {
            status: SongStatus.PUBLISHED,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return Promise.all(
      albums.map((album) => this.withCoverUrl(album)),
    );
  }

  async findAllForAdmin() {
    const albums = await this.prisma.album.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        songs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return Promise.all(
      albums.map((album) => this.withCoverUrl(album)),
    );
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findFirst({
      where: {
        id,
        songs: {
          some: {
            status: SongStatus.PUBLISHED,
          },
        },
      },
      include: {
        songs: {
          where: {
            status: SongStatus.PUBLISHED,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return this.withCoverUrl(album);
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Album not found');
    }

    const album = await this.prisma.album.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return this.withCoverUrl(album);
  }

  async remove(id: string) {
    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Album not found');
    }

    // Preserve existing archive behavior until the schema has
    // an explicit archive/status field.
    return this.prisma.album.update({
      where: { id },
      data: {
        title: existing.title.startsWith('[Archived] ')
          ? existing.title
          : `[Archived] ${existing.title}`,
      },
    });
  }

  private withCoverUrl<T>(album: T): T & {
    coverImageUrl: string | null;
  } {
    return {
      ...album,
      coverImageUrl: null,
    };
  }
}
