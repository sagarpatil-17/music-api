import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AlbumsModule } from './albums/albums.module';
import { HistoryModule } from './history/history.module';
import { LibraryModule } from './library/library.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SongsModule } from './songs/songs.module';


@Module({
  imports: [
    AuthModule,
    AlbumsModule,
    HistoryModule,
    LibraryModule,
    PlaylistsModule,
    SongsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule { }
