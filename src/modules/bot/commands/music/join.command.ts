import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Entra no canal de voz.'),
	async execute(message: any) {
        const player = serverBot.musicPlayer;
        await player.init(message);
        await player.join(message)
	},
};
