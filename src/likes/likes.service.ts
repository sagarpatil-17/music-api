
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SongStatus } from '@prisma/client';
import { isMongoId } from 'class-validator';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: string, field: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException(`Invalid ${field}`);
    }
  }

  async likeSong(userId: string, songId: string) {
    this.validateId(songId, 'song ID');

    const song = await this.prisma.song.findFirst({
      where: {
        id: songId,
        status: SongStatus.PUBLISHED,
      },
      select: { id: true },
    });

    if (!song) {
      throw new NotFoundException('Published song not found');
    }

    // The compound unique constraint prevents duplicate likes.
    return this.prisma.liked_song.upsert({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
      create: {
        userId,
        songId,
      },
      update: {},
      include: {
        song: true,
      },
    });
  }

  async unlikeSong(userId: string, songId: string) {
    this.validateId(songId, 'song ID');

    const existing = await this.prisma.liked_song.findFirst({
      where: {
        userId,
        songId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Song is not in your liked songs');
    }

    await this.prisma.liked_song.delete({
      where: { id: existing.id },
    });

    return {
      message: 'Song removed from liked songs',
      songId,
    };
  }

  async findMyLikedSongs(userId: string) {
    const likes = await this.prisma.liked_song.findMany({
      where: {
        userId,
        song: {
          status: SongStatus.PUBLISHED,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        song: {
          include: {
            album: true,
          },
        },
      },
    });

    return likes.map((like) => ({
      id: like.id,
      likedAt: like.createdAt,
      song: like.song,
    }));
  }

  async getLikeStatus(userId: string, songId: string) {
    this.validateId(songId, 'song ID');

    const like = await this.prisma.liked_song.findFirst({
      where: {
        userId,
        songId,
        song: {
          status: SongStatus.PUBLISHED,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      songId,
      liked: Boolean(like),
    };
  }
}
