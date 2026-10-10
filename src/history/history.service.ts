
import { Injectable, NotFoundException } from '@nestjs/common';
import { SongStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async recordPlay(userId: string, songId: string) {
    const song = await this.prisma.song.findFirst({
      where: { id: songId, status: SongStatus.PUBLISHED },
    });

    if (!song) throw new NotFoundException('Published song not found');

    return this.prisma.listening_history.create({
      data: { userId, songId },
    });
  }

  findMine(userId: string) {
    return this.prisma.listening_history.findMany({
      where: {
        userId,
        song: { status: SongStatus.PUBLISHED },
      },
      orderBy: { playedAt: 'desc' },
      take: 50,
      include: { song: true },
    });
  }

  async updateProgress(
    userId: string,
    historyId: string,
    progressSeconds: number,
    completed: boolean,
  ) {
    const record = await this.prisma.listening_history.findFirst({
      where: { id: historyId, userId },
    });

    if (!record) throw new NotFoundException('History record not found');

    return this.prisma.listening_history.update({
      where: { id: record.id },
      data: { progressSeconds, completed },
    });
  }

  async clearMine(userId: string) {
    return this.prisma.listening_history.deleteMany({
      where: { userId },
    });
  }
}
