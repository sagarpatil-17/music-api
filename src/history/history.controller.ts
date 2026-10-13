import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HistoryService } from './history.service';
import { UpdateHistoryProgressDto } from './dto/update-history-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Listening History')
@ApiBearerAuth()
@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post(':songId')
  recordPlay(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.historyService.recordPlay(user.id, songId);
  }

  @Get()
  getMyHistory(@CurrentUser() user: { id: string }) {
    return this.historyService.getMyHistory(user.id);
  }

  @Patch(':songId/progress')
  updateProgress(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
    @Body() dto: UpdateHistoryProgressDto,
  ) {
    return this.historyService.updateProgress(
      user.id,
      songId,
      dto,
    );
  }

  @Delete()
  clearMyHistory(@CurrentUser() user: { id: string }) {
    return this.historyService.clearMyHistory(user.id);
  }
}