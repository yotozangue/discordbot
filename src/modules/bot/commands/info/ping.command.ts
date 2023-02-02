import { SlashCommandBuilder, Message } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	async execute(message: any) {
        message.reply('Pong!');
	},
};
