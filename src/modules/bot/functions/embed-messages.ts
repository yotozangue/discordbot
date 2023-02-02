import { EmbedBuilder } from "@discordjs/builders";
import { MusicData } from "../interfaces/music-data.interface";
import { MessageColors } from "../enums/message-colors.enum";
import ytpl, { Result } from "ytpl";
import { User } from "discord.js";

export function musicPlaying(music: MusicData) {
    return new EmbedBuilder()
        .setTitle('Now Playing')
        .setURL(music.url)
        .setThumbnail(`${music.thumbnail}`)
        .setColor(MessageColors.DEFAULT)
        .addFields({ name: `${music.title}`, value: `${'`[0:00 / '+ music.duration+ ']`'}`})
        .addFields({ name: ' ', value: `Requested by: ${music.user}` })
}

export function musicQueue(music: MusicData, position: number) {
    return new EmbedBuilder()
        .setTitle('Na Fila')
        .setURL(music.url)
        .setThumbnail(`${music.thumbnail}`)
        .setColor(MessageColors.BLACK)
        .addFields({ name: `${music.title}`, value: `${'`[0:00 / '+ music.duration+ ']`'}`})
        .addFields({ name: ' ', value: `Adicionada por: ${music.user}` })
        .setFooter({ text: `Na posição #${position}` })
}

export async function addedPlaylist(url: string, user: User) {
    const playlist = await ytpl(url);
    return new EmbedBuilder()
        .setTitle('Playlist Adicionada')
        .setURL(playlist.url)
        .setThumbnail(`${playlist.thumbnails[0].url}`)
        .setColor(MessageColors.BLACK)
        .addFields({ name: `${playlist.title}`, value: `Adicinando ${playlist.items.length} músicas.`})
        .addFields({ name: ' ', value: `Adicionada por: ${user}` })
}

export function listMusics(musics: MusicData[], page: number) {
    const totalUnits = musics.length - 1;
    const unitsPerStack = 5;

    const stacks = Math.floor(totalUnits / unitsPerStack) + 1;

    let i = (page * unitsPerStack) - unitsPerStack + 1;
    if (page > stacks) {
        return new EmbedBuilder()
            .setDescription(`Não tem musga pra isso tudo não :rage:`)
            .setColor(MessageColors.RAGE)
    }

    const embed = new EmbedBuilder()
            .setTitle('Lista de Músicas')
            .addFields({ name: ' ', value: `**Tocando agora:** ${musics[0].title}` })
            .setColor(MessageColors.DEFAULT)
            .setFooter({ text: `Página ${page}/${stacks}` })

    if (musics[i]) {
        musics.slice(i, (page*unitsPerStack)).map(music => {
            embed.addFields({ name: ' ', value: `**${(i + 1)}.** ${music.title}` });
            i++;
        })
    } else {
        embed.addFields({ name: ' ', value: 'A lista está limpa.' })
    }
    return embed;
}

