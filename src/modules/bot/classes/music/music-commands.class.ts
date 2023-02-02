import { AudioPlayer, AudioPlayerStatus, AudioResource } from '@discordjs/voice';
import { EmbedBuilder, Guild, VoiceChannel } from 'discord.js';
import ytpl from 'ytpl';

import { MessageColors } from '../../enums/message-colors.enum';
import { Source } from '../../enums/source-media.enum';
import { addedPlaylist, listMusics, musicPlaying, musicQueue } from '../../functions/embed-messages';
import { embedReply, replyEmbed } from '../../functions/reply-embed.function';
import { reply } from '../../functions/reply.function';
import { Bot } from '../bot.class';
import { AudioManager } from './audio-manager.class';
import { MusicSource } from './music-source.class';
import { queue, QueueManager } from './queue-manager.class';
import { YoutubePlayer } from './youtube-source.class';

export class MusicCommands {

    #client: Bot;
    #audioManager: AudioManager;
    #queueManager: QueueManager;
    #musicSource: MusicSource[];

    constructor(
        client: Bot
    ) {
        this.#client = client;
        this.#musicSource = [];
    }

    async init(message: any) {
        const guild: Guild = message.guild;
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        this.#audioManager = new AudioManager(voiceChannel, guild, message.channel);
        this.#queueManager = new QueueManager(message.guild);
    }

    // Commands Track [play, next, pause, resume]
    async play(message: any): Promise<void> {
        const queues = this.#queueManager.getQueues();
        
        if (!this.#audioManager) {
            await this.init(message);
        }

        if (!queue.get(message.guild.id)?.connection) {
            await this.join(message);
        }

        if(!this.#queueManager.getStatusPlaying()) {
            if (!queues[0]) {
                return replyEmbed(message, 'acabo as musga', ':sob:', MessageColors.BLACK, false);
            }

            if (queues[0].source === Source.YOUTUBE) {
                const resource: AudioResource = this.#musicSource[Source.YOUTUBE].getResource(queues[0]);
                this.#audioManager.play(resource);
            }
            
            const player = this.#audioManager.player;
            this.playerStates(message, player);
        }
    }

    next(message: any) {
        if(this.#queueManager.nextQueue())
            this.#audioManager.pause();
            this.play(message);
    }

    pause(message: any): void {
        try {
            this.#audioManager.pause();
            reply(message, ':sunglasses: Secretária stop!')
        } catch (error) {
            reply(message, ':sunglasses: eu nao to tocando nada!')
        }
    }

    resume(message: any): void {
        try {
            this.#audioManager.resume();
            reply(message, ':sunglasses: Secretária resume!')
        } catch (error) {
            reply(message, ':sunglasses: nao tenho nada na lista!')
        }
        
    }

    // Commands Audio Manager [join, leave, restart, volume]
    async join(message: any): Promise<void> {
        if (this.#audioManager.join()) {
            return replyEmbed(message, 'Entrando no canal de voz', ':sunglasses:', MessageColors.BLACK);
        }
    }

    leave(message: any): Promise<void> {

        if(!this.#audioManager) {
            return replyEmbed(message, 'Para eu sair de um canal de voz eu preciso estar em um **CANAL DE VOZ**', ':rage:', MessageColors.RAGE);
        }

        this.#audioManager.leave();
        return replyEmbed(message, 'Saindo do canal de voz', ':confused:', 0x00F0DA);
    }

    async restart(message: any): Promise<void> {
        try {
            if(this.#queueManager.getStatusPlaying()) {
                this.#queueManager.updateStatusPlaying(false);
                replyEmbed(message, 'Reiniciando a música...', ':robot:', MessageColors.BLACK, false)
                this.play(message);
            }
        } catch (error) {
            console.error(error);
            return replyEmbed(message, 'Erro Bip Bop Erro!', ':rage:', MessageColors.RAGE);
        }
    }

    async volume(message: any): Promise<void>{
        const volume = message.options.getNumber('volume')
        
        try {
            this.#queueManager.setVolume(volume);
            replyEmbed(message, `Volume alterado com sucesso!`, ':sunglasses:')
            this.restart(message);
        } catch (error) {
            return replyEmbed(message, 'Erro Bip Bop Erro!', ':rage:', MessageColors.RAGE);
        }
        
    }

    // Commands Track [addTracks, list, remove]
    async addTracks(message: any) {

        if (!this.#audioManager) {
            await this.init(message);
            await this.join(message);
        }

        const music = message.options.getString('music');

        this.#musicSource[Source.YOUTUBE] = new YoutubePlayer();

        await this.#musicSource[Source.YOUTUBE].addTrack(music, message.user);
        const tracks = this.#musicSource[Source.YOUTUBE].tracks;

        // (tracks.length === 1) true => send video info; false => send playlist info
        if (tracks.length === 1) {
            return this.#queueManager.addQueues(tracks[0], true, message);
        } else {

            tracks.forEach(async(track) => {
                this.#queueManager.addQueues(track); 
            })
            embedReply(message, await addedPlaylist(music, message.user))
        }
    }


    async list(message: any, page?: number) {
        page = (page) ? page : 1;
        try {
            const musics = this.#queueManager.getQueues();
            embedReply(message, listMusics(musics, page));
        } catch (error) {
            return replyEmbed(message, 'Tem musga nao :/', ':rage:', MessageColors.RAGE, false);
        }
    }   

    async remove(message: any) {

        try {
            const musics = this.#queueManager.getQueues();
            const position = message.options.getInteger('music')

            if (position === 0) {
                return replyEmbed(message, 'Você não pode remover a música que está tocando', ':rage:', MessageColors.RAGE);
            }

            if (position > musics.length || position < 0) {
                return replyEmbed(message, 'Essa musga não existe', ':rage:', MessageColors.RAGE);
            }

            if (this.#queueManager.removeQueue((position - 1))) {
                const music = musics[(position - 1)];
                return replyEmbed(message, `Música **${music.title}** removida da lista de reprodução!`, ':pleading_face:', MessageColors.DEFAULT)
            }

        } catch (error) {
            return replyEmbed(message, 'Não tem nada tocando', ':rage:', MessageColors.RAGE);
        }
    }

    // Player States (to change music)
    playerStates(message: any, player: AudioPlayer): void {
        const queues = this.#queueManager.getQueues();
        const music = queues[0];

        player.on(AudioPlayerStatus.Idle, () => {
            this.#queueManager.updateStatusPlaying(false);
            this.next(message);
        })

        player.on(AudioPlayerStatus.Playing, () => {
            this.#queueManager.updateStatusPlaying(true);
            const res = musicPlaying(music);
            message.reply({ embeds:[res] }).catch((error: any) => {
                message.channel.send({ embeds:[res] });   
            })
        })

        player.on(AudioPlayerStatus.Paused, () => {
            this.#queueManager.updateStatusPlaying(false);
        })
    }
}
