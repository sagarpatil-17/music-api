
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import type { Multer } from 'multer';

@Injectable()
export class StorageService {
    private readonly supabase: SupabaseClient;
    private readonly musicBucket: string;
    private readonly albumCoversBucket: string;
    private readonly playlistCoversBucket: string;

    constructor(config: ConfigService) {
        this.supabase = createClient(
            config.getOrThrow<string>('SUPABASE_URL'),
            config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );

        this.musicBucket =
            config.get<string>('SUPABASE_MUSIC_BUCKET') || 'music';

        this.albumCoversBucket =
            config.get<string>('SUPABASE_ALBUM_COVER_BUCKET') || 'album_cover';

        this.playlistCoversBucket =
            config.get<string>('SUPABASE_PLAYLIST_COVER_BUCKET') ||
            'playlist_cover';
    }

    async uploadAudio(file: Express.Multer.File) {
        if (!file || !file.mimetype.startsWith('audio/')) {
            throw new BadRequestException('Please upload a valid audio file');
        }

        const extension = extname(file.originalname).toLowerCase();
        const allowed = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];

        if (!allowed.includes(extension)) {
            throw new BadRequestException('Unsupported audio format');
        }

        const path = `${randomUUID()}${extension}`;

        const { error } = await this.supabase.storage
            .from(this.musicBucket)
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new InternalServerErrorException(
                `Audio upload failed: ${error.message}`,
            );
        }

        return { audioPath: path };
    }

    async uploadCover(
        file: Express.Multer.File,
        type: 'album' | 'playlist' = 'album',
    ) {
        if (!file || !file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Please upload an image');
        }

        const extension = extname(file.originalname).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];

        if (!allowed.includes(extension)) {
            throw new BadRequestException('Unsupported image format');
        }

        const bucket =
            type === 'playlist'
                ? this.playlistCoversBucket
                : this.albumCoversBucket;

        const path = `${randomUUID()}${extension}`;

        const { error } = await this.supabase.storage
            .from(bucket)
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new InternalServerErrorException(
                `Cover upload failed: ${error.message}`,
            );
        }

        return { coverImagePath: path };
    }


    async getAudioUrl(path: string) {
        const cleanPath = path?.trim();

        if (!cleanPath) {
            throw new BadRequestException('Audio path is required');
        }

        const { data, error } = await this.supabase.storage
            .from(this.musicBucket)
            .createSignedUrl(cleanPath, 3600);

        if (error || !data?.signedUrl) {
            console.error('Supabase signed URL error:', error?.message);

            throw new InternalServerErrorException(
                'Could not create playback URL',
            );
        }

        return {
            url: data.signedUrl,
            expiresIn: 3600,
        };
    }

    async getCoverUrl(
        path: string,
        type: 'album' | 'playlist' = 'album',
    ) {
        const bucket =
            type === 'playlist'
                ? this.playlistCoversBucket
                : this.albumCoversBucket;

        const { data, error } = await this.supabase.storage
            .from(bucket)
            .createSignedUrl(path, 3600);

        if (error || !data?.signedUrl) {
            throw new InternalServerErrorException(
                'Could not create cover URL',
            );
        }

        return { url: data.signedUrl, expiresIn: 3600 };
    }
}
