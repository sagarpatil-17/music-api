
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SongStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) { }

  async uploadAudio(file: Express.Multer.File) {
    return this.storage.uploadAudio(file);
  }

  async create(dto: CreateSongDto) {
    return this.prisma.song.create({
      data: {
        title: dto.title,
        description: dto.description,
        artists: dto.artists,
        audioPath: dto.audioPath,
        albumId: dto.albumId || null,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
        status: SongStatus.DRAFT,
      },
    });
  }


  async findAll(search?: string) {
    const term = search?.trim();

    return this.prisma.song.findMany({
      where: {
        status: SongStatus.PUBLISHED,
        ...(term
          ? {
            title: {
              contains: term,
              mode: 'insensitive',
            },
          }
          : {}),
      },
      include: {
        album: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const song = await this.prisma.song.findFirst({
      where: {
        id,
        status: SongStatus.PUBLISHED,
      },
      include: {
        album: true,
      },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return song;
  }

  async findAllForAdmin(search?: string) {
    const term = search?.trim();

    return this.prisma.song.findMany({
      where: term
        ? {
          title: {
            contains: term,
            mode: 'insensitive',
          },
        }
        : {},
      include: {
        album: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPlaybackUrl(id: string) {
    // This lookup rejects drafts and unpublished songs.
    const song = await this.findOne(id);

    if (!song.audioPath?.trim()) {
      throw new NotFoundException('Audio file not found for this song');
    }

    const playback = await this.storage.getAudioUrl(song.audioPath);

    return {
      songId: song.id,
      title: song.title,
      artists: song.artists,
      ...playback,
    };
  }

  async update(id: string, dto: UpdateSongDto) {
    const song = await this.prisma.song.findUnique({ where: { id } });
    if (!song) throw new NotFoundException('Song not found');

    return this.prisma.song.update({
      where: { id },
      data: {
        ...dto,
        releaseDate: dto.releaseDate
          ? new Date(dto.releaseDate)
          : undefined,
      },
    });
  }

  async publish(id: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });
    if (!song) throw new NotFoundException('Song not found');

    return this.prisma.song.update({
      where: { id },
      data: { status: SongStatus.PUBLISHED },
    });
  }

  async remove(id: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });
    if (!song) throw new NotFoundException('Song not found');

    // Preserve records referenced by playlists, likes, and history.
    return this.prisma.song.update({
      where: { id },
      data: { status: SongStatus.UNPUBLISHED },
    });
  }
}
