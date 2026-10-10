
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsBoolean, IsInt, Min } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HistoryService } from './history.service';
import { ApiTags } from '@nestjs/swagger';

class UpdateProgressDto {
  @IsInt()
  @Min(0)
  progressSeconds: number;

  @IsBoolean()
  completed: boolean;
}

@ApiTags('HistoryController')
@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private history: HistoryService) {}

  @Post(':songId')
  recordPlay(
    @CurrentUser() user: { id: string },
    @Param('songId') songId: string,
  ) {
    return this.history.recordPlay(user.id, songId);
  }

  @Get()
  findMine(@CurrentUser() user: { id: string }) {
    return this.history.findMine(user.id);
  }

  @Patch(':historyId/progress')
  updateProgress(
    @CurrentUser() user: { id: string },
    @Param('historyId') historyId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.history.updateProgress(
      user.id,
      historyId,
      dto.progressSeconds,
      dto.completed,
    );
  }

  @Delete()
  clearMine(@CurrentUser() user: { id: string }) {
    return this.history.clearMine(user.id);
  }
}
