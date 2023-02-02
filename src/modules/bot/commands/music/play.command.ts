import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music')
        .addStringOption(option => 
            option.setName('music')
                .setDescription('URL da música')
                .setRequired(false)),
	async execute(message: any) {
        const player = serverBot.musicPlayer;
        await player.addTracks(message); 
        await player.play(message);
	},
};
