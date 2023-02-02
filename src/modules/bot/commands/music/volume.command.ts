import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Set volume music')
        .addNumberOption(option => 
            option.setName('volume')
                .setDescription('Volume de 0 a 2 (default: 0.1)')
                .setRequired(true)),
	async execute(message: any) {
        const player = serverBot.musicPlayer;
        await player.init(message);
        await player.volume(message);
	},
};
