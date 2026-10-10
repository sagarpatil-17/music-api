
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { IsMongoId } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ApiTags } from '@nestjs/swagger';

class AddSongDto {
  @IsMongoId()
  songId: string;
}

@ApiTags('PlaylistsController')
@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private playlists: PlaylistsService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePlaylistDto,
  ) {
    return this.playlists.create(user.id, dto);
  }

  @Get('my')
  findMine(@CurrentUser() user: { id: string }) {
    return this.playlists.findMine(user.id);
  }

  @Get(':id')
  getOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.playlists.getOwned(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlists.update(id, user.id, dto);
  }

  @Post(':id/songs')
  addSong(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: AddSongDto,
  ) {
    return this.playlists.addSong(id, user.id, dto.songId);
  }

  @Delete(':id/songs/:songId')
  removeSong(
    @Param('id') id: string,
    @Param('songId') songId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.playlists.removeSong(id, user.id, songId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.playlists.removePlaylist(id, user.id);
  }
}
