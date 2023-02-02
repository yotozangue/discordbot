import { VoiceChannel } from "discord.js";
import { MusicData } from './music-data.interface';

export interface MusicQueue {
    voiceChannel: VoiceChannel;
    connection: any;
    musics: MusicData[];
    volume: number;
    playing: boolean;
}
