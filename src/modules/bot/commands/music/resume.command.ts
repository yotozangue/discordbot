import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume music'),
	async execute(message: any) {
        const player = serverBot.musicPlayer;
        //await player.joinVoiceChannel(message);
        player.resume(message);
	},
};
