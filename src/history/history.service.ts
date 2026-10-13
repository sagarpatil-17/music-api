import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHistoryProgressDto } from './dto/update-history-progress.dto';
import { SongStatus } from '@prisma/client';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Record a new listening session.
  async recordPlay(userId: string, songId: string) {
    if (!isMongoId(songId)) {
      throw new BadRequestException('Invalid song ID');
    }

    const song = await this.prisma.song.findFirst({
      where: {
        id: songId,
        status: SongStatus.PUBLISHED,
      },
    });

    if (!song) {
      throw new NotFoundException('Published song not found');
    }

    const history = await this.prisma.listening_history.create({
      data: {
        userId,
        songId,
        progressSeconds: 0,
        completed: false,
      },
      include: {
        song: {
          include: {
            album: true,
          },
        },
      },
    });

    // Increment the song's play count.
    await this.prisma.song.update({
      where: { id: songId },
      data: {
        playCount: {
          increment: 1,
        },
      },
    });

    return history;
  }

  // Get the authenticated user's listening history.
  async getMyHistory(userId: string) {
    return this.prisma.listening_history.findMany({
      where: {
        userId,
        song: {
          is: {
            status: SongStatus.PUBLISHED,
          },
        },
      },
      orderBy: {
        playedAt: 'desc',
      },
      include: {
        song: {
          include: {
            album: true,
          },
        },
      },
    });
  }

  // Update the most recent listening session for a song.
  async updateProgress(
    userId: string,
    songId: string,
    dto: UpdateHistoryProgressDto,
  ) {
    if (!isMongoId(songId)) {
      throw new BadRequestException('Invalid song ID');
    }

    const latestHistory =
      await this.prisma.listening_history.findFirst({
        where: {
          userId,
          songId,
          song: {
            is: {
              status: SongStatus.PUBLISHED,
            },
          },
        },
        orderBy: {
          playedAt: 'desc',
        },
      });

    if (!latestHistory) {
      throw new NotFoundException(
        'Listening history not found for this song',
      );
    }

    return this.prisma.listening_history.update({
      where: {
        id: latestHistory.id,
      },
      data: {
        progressSeconds: dto.progressSeconds,
        ...(dto.completed !== undefined
          ? { completed: dto.completed }
          : {}),
      },
      include: {
        song: {
          include: {
            album: true,
          },
        },
      },
    });
  }

  // Delete only the authenticated user's history.
  async clearMyHistory(userId: string) {
    const result = await this.prisma.listening_history.deleteMany({
      where: {
        userId,
      },
    });

    return {
      message: 'Listening history cleared successfully',
      deletedCount: result.count,
    };
  }
}
