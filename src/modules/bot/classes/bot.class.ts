
import { Client, ClientOptions, Collection, Events, REST, Routes } from 'discord.js';
import { Config } from '../interfaces/config.interface';
import { getFiles } from '../utils/file.util';
import { guildCommands } from '../functions/rest-api.function';
import { activity } from '../default/bot-activity.default';

export abstract class Bot extends Client {

    #config: Config;
    #commandsJSON: any[];

    constructor(
        options: ClientOptions
    ) {
        super(options);

        this.#commandsJSON = [];

        this.#config = {
            guild: process.env.GUILD_ID,
            client: process.env.CLIENT_ID,
            token: process.env.TOKEN
        }
    }

    public async init(): Promise<void> {
        this.login(this.#config.token)
            .then(async () => {
                this.setup();
            })
    }

    private async setup(): Promise<void> {

        const guild = this.guilds.cache.get(`${this.#config.guild}`);
        let commands: any;

        if (guild) {
            commands = guild.commands;
        } else {
            commands = this.application?.commands;
        }

        commands = new Collection();

        const commandFiles = await getFiles('commands');

        for (const file of commandFiles) {
            const command = require(file);
            commands?.set(command.data.name, command);
            this.#commandsJSON.push(command.data);
        }

        this.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Aconteceu algum erro!', ephemeral: true });
            }
        });

        this.on('ready', () => {
            this.user?.setActivity(activity);
        })

        this.restAPI();

    }

    private async restAPI(): Promise<void> {
        
        const { client, token, guild } = this.#config;

        const rest = new REST({ version: '10' }).setToken(`${token}`);
        await guildCommands(rest, this.#commandsJSON, `${client}`, `${guild}`)
    }

}
