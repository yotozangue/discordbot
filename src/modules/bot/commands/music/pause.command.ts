import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause music'),
	async execute(message: any) {
        const player = serverBot.musicPlayer;
        //await player.joinVoiceChannel(message);
        await player.pause(message);
	},
};
