import { Guild } from 'discord.js';

import { musicQueue } from '../../functions/embed-messages';
import { embedReply } from '../../functions/reply-embed.function';
import { MusicData } from '../../interfaces/music-data.interface';
import { MusicQueue } from '../../interfaces/music-queue.interface';

export let queue = new Map<string, MusicQueue>;

// Responsável por adicionar, remover e manipular a lista de reprodução. 
export class QueueManager {

    #guild: Guild;

    constructor(guild: Guild) {
        this.#guild = guild;
    }

    removeQueue(position: number) {
        const currentQueue = queue.get(this.#guild.id);

        if (!currentQueue) {
            return false;
        }

        currentQueue?.musics.splice(position, 1);
        const updatedQueue = {...currentQueue};
        queue.set(this.#guild.id, updatedQueue);
        return true;
    }

    getStatusPlaying() {
        const currentQueue = queue.get(this.#guild.id);

        if (!currentQueue) {
            return false;
        }

        return currentQueue.playing;
    }

    updateStatusPlaying(newStatus: boolean) {
        const currentQueue = queue.get(this.#guild.id);

        if (!currentQueue) {
            return false;
        }

        currentQueue.playing = newStatus;
        const updatedQueue = {...currentQueue};
        queue.set(this.#guild.id, updatedQueue);
        return true;
    }

    setVolume(volume: number) {
        const currentQueue = queue.get(this.#guild.id);

        if (!currentQueue) {
            return false;
        }

        currentQueue.volume = volume;

        const updatedQueue = {...currentQueue};
        queue.set(this.#guild.id, updatedQueue);
        
        return true;
    }

    nextQueue() {
        const currentQueue = queue.get(this.#guild.id);

        if (!currentQueue) {
            return false;
        }

        currentQueue?.musics.shift();
        const updatedQueue = {...currentQueue};
        queue.set(this.#guild.id, updatedQueue);

        return true;
    }


    addQueues(music: MusicData, sendMessage?: boolean, message?: any): boolean {
        
        const currentQueue = queue.get(this.#guild.id);

        if (!currentQueue) {
            return false;
        }
        const position = currentQueue.musics.length;
        const updatedQueue = {...currentQueue, musics: [...currentQueue.musics, music]};
        queue.set(this.#guild.id, updatedQueue);

        if (position != 0) {
        if (sendMessage) {
                embedReply(message, musicQueue(music, position));
            }
        }
        
        return true;
    }

    getQueues(): MusicData[] {
        const currentQueue = queue.get(this.#guild.id);
        return currentQueue!.musics;
    }

}
