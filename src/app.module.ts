import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AlbumsModule } from './albums/albums.module';
import { HistoryModule } from './history/history.module';
import { LibraryModule } from './library/library.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SongsModule } from './songs/songs.module';
import { StorageModule } from './storage/storage.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LikesModule } from './likes/likes.module';
import { ProfileModule } from './profile/profile.module';


@Module({
  imports: [
    AuthModule,
    AlbumsModule,
    DashboardModule,
    HistoryModule,
    LibraryModule,
    PlaylistsModule,
    SongsModule,
    LikesModule,
    ProfileModule,
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule { }
