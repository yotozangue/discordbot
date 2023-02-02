import { User } from 'discord.js';

export async function reply(message: any, description: string, sendUserName?: boolean, user?: User) {


    if (sendUserName === undefined) {
        sendUserName = true;
        user = message.user;
    }
   
    try {
        await message.reply(description);
    } catch (error) {
        await message.channel.send(`${description} ${(sendUserName) ? `[${user}]` : ''}`)
    }

}
