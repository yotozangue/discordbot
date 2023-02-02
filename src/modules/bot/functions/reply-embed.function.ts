import { ColorResolvable, Embed, EmbedBuilder, User } from 'discord.js';
import { MessageColors } from '../enums/message-colors.enum';

export async function embedReply(message: any, embed: Embed | EmbedBuilder) {
    message.reply({ embeds:[embed] }).catch((error: any) => {
        message.channel.send({ embeds:[embed] });   
    })
}

export async function replyEmbed(message: any, description: string, emoji?: string, color?: ColorResolvable, sendUserName?: boolean, user?: User) {

    if (!color) {
        color = MessageColors.BLACK;
    }

    if (!sendUserName) {
        sendUserName = true;
    }

    if (!user) {
        user = message.user;
    }

    try {
        await message.reply({ embeds: [simpleEmbed(`${description} ${emoji}`, color)] });
    } catch (error) {
        await message.channel.send({ embeds: [simpleEmbed(`${description} ${(sendUserName) ? `[${user}]` : ''} ${emoji}`, color )]})
    } finally {
        return;
    }
}

export function simpleEmbed(description: string, color: ColorResolvable) {
    return new EmbedBuilder()
    .setColor(color)
    .setDescription(description)
}

