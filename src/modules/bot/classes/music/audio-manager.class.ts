import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    joinVoiceChannel,
    VoiceConnection,
} from '@discordjs/voice';
import { Channel, EmbedBuilder, Guild, VoiceChannel } from 'discord.js';

import { MessageColors } from '../../enums/message-colors.enum';
import { queue, QueueManager } from './queue-manager.class';
import { Source } from '../../enums/source-media.enum';

// Responsável por reproduzir, pausar, retomar e controlar o volume do áudio.
export class AudioManager {

    #guild: Guild;
    #voiceChannel: VoiceChannel;
    #player: AudioPlayer;
    #conection: VoiceConnection;
    #channel: any;

    constructor(voiceChannel: VoiceChannel, guild: Guild, channel: Channel) {
        this.#guild = guild;
        this.#voiceChannel = voiceChannel;
        this.#channel = channel;
        this.start();
    }

    get player() {
        return this.#player;
    }

    get conection() {
        return this.#conection;
    }

    private start(): void {
        
        if(!queue.has(this.#guild.id)) {
            queue.set(this.#guild.id, {
                voiceChannel: this.#voiceChannel,
                connection: null,
                musics: [],
                volume: 0.1,
                playing: false
            })
        }
    }


    subscribe() {
        const currentQueue = queue.get(this.#guild.id);
 
        if (!currentQueue) {
            return;
        }

        this.#player = createAudioPlayer();
        this.#conection = currentQueue.connection;
        this.#conection.subscribe(this.#player);
    }

    play(resource: AudioResource) {

        const volume = queue.get(this.#guild.id)!.volume;

        this.subscribe();

        resource.volume?.setVolume(volume);
        this.#player.play(resource);
    }

    pause() {
        this.#player.pause();
    }

    resume() {
        this.#player.unpause();
    }


    join(): boolean {
        
        const currentQueue = queue.get(this.#guild.id);
        
        if (!currentQueue) {
            return false;
        }

        if (!currentQueue?.connection) {
            const connection = joinVoiceChannel({
                channelId: this.#voiceChannel.id,
                guildId: this.#voiceChannel.guildId,
                adapterCreator: this.#voiceChannel.guild.voiceAdapterCreator,
            })
            
            const updatedQueue = { ...currentQueue, connection: connection };
            queue.set(this.#guild.id, updatedQueue);

            return true;
        }

        return false;
    }

    leave(): boolean {

        const connection = queue.get(this.#guild.id)?.connection;

        if (!connection) {
            return false;
        }

        connection.destroy();
        queue.delete(this.#guild.id);
        return true;
    }

}
