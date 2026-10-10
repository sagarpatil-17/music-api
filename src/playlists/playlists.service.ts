
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SongStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: { ...dto, userId },
    });
  }

  findMine(userId: string) {
    return this.prisma.playlist.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        songs: {
          orderBy: { position: 'asc' },
          include: { song: true },
        },
      },
    });
  }

  async getOwned(id: string, userId: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        songs: {
          orderBy: { position: 'asc' },
          include: { song: true },
        },
      },
    });

    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You do not own this playlist');
    }

    return playlist;
  }

  async update(id: string, userId: string, dto: UpdatePlaylistDto) {
    await this.getOwned(id, userId);

    return this.prisma.playlist.update({
      where: { id },
      data: dto,
    });
  }

  async addSong(id: string, userId: string, songId: string) {
    const playlist = await this.getOwned(id, userId);

    const song = await this.prisma.song.findFirst({
      where: { id: songId, status: SongStatus.PUBLISHED },
    });

    if (!song) throw new NotFoundException('Published song not found');

    const existing = await this.prisma.playlist_song.findFirst({
      where: { playlistId: id, songId },
    });

    if (existing) return existing;

    const position = playlist.songs.reduce(
      (max, item) => Math.max(max, item.position),
      -1,
    ) + 1;

    return this.prisma.playlist_song.create({
      data: { playlistId: id, songId, position },
    });
  }

  async removeSong(id: string, userId: string, songId: string) {
    await this.getOwned(id, userId);

    const item = await this.prisma.playlist_song.findFirst({
      where: { playlistId: id, songId },
    });

    if (!item) throw new NotFoundException('Song is not in this playlist');

    return this.prisma.playlist_song.delete({
      where: { id: item.id },
    });
  }

  async removePlaylist(id: string, userId: string) {
    await this.getOwned(id, userId);

    // Delete child records first; MongoDB relations do not cascade automatically.
    await this.prisma.playlist_song.deleteMany({
      where: { playlistId: id },
    });

    return this.prisma.playlist.delete({ where: { id } });
  }
}
