
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SongStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async likeSong(userId: string, songId: string) {
    const song = await this.prisma.song.findFirst({
      where: { id: songId, status: SongStatus.PUBLISHED },
    });

    if (!song) throw new NotFoundException('Published song not found');

    return this.prisma.liked_song.upsert({
      where: {
        userId_songId: { userId, songId },
      },
      create: { userId, songId },
      update: {},
    });
  }

  async unlikeSong(userId: string, songId: string) {
    const liked = await this.prisma.liked_song.findUnique({
      where: {
        userId_songId: { userId, songId },
      },
    });

    if (!liked) throw new NotFoundException('Song is not liked');

    return this.prisma.liked_song.delete({
      where: { id: liked.id },
    });
  }

  findliked_songs(userId: string) {
    return this.prisma.liked_song.findMany({
      where: {
        userId,
        song: { status: SongStatus.PUBLISHED },
      },
      orderBy: { createdAt: 'desc' },
      include: { song: true },
    });
  }
}
