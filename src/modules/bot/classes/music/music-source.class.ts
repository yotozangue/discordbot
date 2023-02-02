import { MusicData } from '../../interfaces/music-data.interface';
import { User } from 'discord.js';
import { AudioResource } from '@discordjs/voice';

// classe para administrar a leitura de dados de fontes externas (como o YouTube e o Spotify) 
export abstract class MusicSource {

    protected _tracks: MusicData[];

    constructor() {
        this._tracks = [];
    }

    get tracks(): MusicData[] {
        return this._tracks;
    }

    abstract addTrack(music: string, user: User): Promise<void>;

    protected isUrl(url: string): boolean {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(url);
    }

    abstract getResource(music: MusicData): AudioResource;

}
