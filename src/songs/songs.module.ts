
import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { StorageModule } from '../storage/storage.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [StorageModule],
  controllers: [SongsController],
  providers: [SongsService, PrismaService],
})
export class SongsModule { }
