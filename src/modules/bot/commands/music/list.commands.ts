import { SlashCommandBuilder, Message } from 'discord.js';
import { serverBot } from '../../../../server';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List Musics Queued')
        .addIntegerOption(option => 
            option.setName('page')
            .setDescription('Número da página.')
            .setRequired(false)),
	async execute(message: any) {
        let page = message.options.getInteger('page');
        const bot = serverBot;
        const player = bot.musicPlayer;
        player.list(message, page);
	},
};
