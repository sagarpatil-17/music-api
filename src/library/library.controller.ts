
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryService } from './library.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LibraryController')
@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private library: LibraryService) {}

  @Get('liked-songs')
  findLikedSongs(@CurrentUser() user: { id: string }) {
    return this.library.findliked_songs(user.id);
  }

  @Post('liked-songs/:songId')
  likeSong(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.library.likeSong(user.id, songId);
  }

  @Delete('liked-songs/:songId')
  unlikeSong(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.library.unlikeSong(user.id, songId);
  }
}
