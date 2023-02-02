import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remover música da Lista de Reprodução')
        .addIntegerOption(option => 
            option.setName('music')
            .setDescription('Número da música.')
            .setRequired(true)),
	async execute(message: any) {
        const bot = serverBot;
        const player = bot.musicPlayer;
        player.remove(message);
	},
};
