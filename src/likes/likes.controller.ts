
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LikesService } from './likes.service';

@ApiTags('LikesController')
@ApiBearerAuth()
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likes: LikesService) {}

  @Post(':songId')
  @ApiOperation({ summary: 'Like a published song' })
  likeSong(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.likes.likeSong(user.id, songId);
  }

  @Delete(':songId')
  @ApiOperation({ summary: 'Remove a song from liked songs' })
  unlikeSong(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.likes.unlikeSong(user.id, songId);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user liked songs' })
  findMyLikedSongs(@CurrentUser() user: { id: string }) {
    return this.likes.findMyLikedSongs(user.id);
  }

  @Get(':songId/status')
  @ApiOperation({ summary: 'Check liked song status' })
  getLikeStatus(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.likes.getLikeStatus(user.id, songId);
  }
}
