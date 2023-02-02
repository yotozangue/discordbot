import { AudioResource, createAudioResource } from '@discordjs/voice';
import { User } from 'discord.js';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import ytsr from 'ytsr';

import { Source } from '../../enums/source-media.enum';
import { YtType } from '../../enums/youtube-url-type.enum';
import { MusicSource } from './music-source.class';
import { MusicData } from '../../interfaces/music-data.interface';

export class YoutubePlayer extends MusicSource {
    
    getResource(music: MusicData): AudioResource {
        const stream = ytdl(music.url, { filter: 'audioonly' });
        const resource = createAudioResource(stream, {
            inlineVolume: true,
        });
        return resource;
    }


    async addTrack(music: string, user: User): Promise<void> {
        
        if (!this.isUrl(music)) {
            const search: any = (await ytsr(music, { limit: 1 })).items[0];
            music = search.url;
        }

        const type = this.typeUrl(music);

        if (type === YtType.UNKNOWN) {
            return;
        }

        if (type === YtType.PLAYLIST) {
            const search = (await ytpl(music)).items;
            await Promise.all(search.map(async (music) => {
                const seconds = Number.parseInt(`${music.durationSec}`);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                const formattedTime = `${minutes.toString().padStart(2, "0")}:${(remainingSeconds < 10 ? '0':'') + remainingSeconds}`;

                this._tracks.push({
                    title: music.title,
                    url: music.shortUrl,
                    thumbnail: `${music.thumbnails[0].url}`,
                    source: Source.YOUTUBE,
                    duration: formattedTime,
                    user: user
                })

            }));
        }

        if (type === YtType.VIDEO){
            await this.addMusic(music, user);
        }

        return;
    }

    private async addMusic(url: string, user: User): Promise<void> {
        return new Promise(async (resolve) => {
            ytdl.getInfo(url)
                .then(response => {
                    const seconds = Number.parseInt(response.videoDetails.lengthSeconds);
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    const formattedTime = `${minutes.toString().padStart(2, "0")}:${(remainingSeconds < 10 ? '0':'') + remainingSeconds}`;
                    this._tracks.push({
                        title: response.videoDetails.title,
                        url: response.videoDetails.video_url,
                        thumbnail: response.videoDetails.thumbnails[0].url,
                        source: Source.YOUTUBE,
                        duration: formattedTime,
                        user: user
                    })
                    resolve();
                })
        });
    }

    private typeUrl(url: string): YtType {
        const videoRegex: RegExp = /watch\?v=/;
        const playlistRegex: RegExp = /playlist\?list=/;

        if (videoRegex.test(url)) {
            return YtType.VIDEO;
        } else if (playlistRegex.test(url)) {
            return YtType.PLAYLIST;
        }
        return YtType.UNKNOWN;
    }
}
