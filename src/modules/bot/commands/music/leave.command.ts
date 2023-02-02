import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave voice channel'),
	async execute(message: any) {
        const bot = serverBot;
        const player = bot.musicPlayer;
        player.leave(message);
	},
};
