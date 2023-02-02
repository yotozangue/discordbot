import { Message, SlashCommandBuilder, Collection } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear 100 Messages'),
	async execute(message: any) {

        if(!message.member) {
            throw new Error('No message');
        }

        if(!message.member.roles.cache.some((role: any) => role.name === 'Manager')) {
            return message.reply('Desculpe, você não tem permissão para usar este comando.');
        }
        const fetched = await message.channel.messages.fetch({limit: 100});
        await message.channel.bulkDelete(fetched);
        message.reply('Chat limpo :broom:')
	},
};
