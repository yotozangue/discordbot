import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Next music'),
	async execute(message: any) {
        const player = serverBot.musicPlayer;
        player.next(message);
	},
};
