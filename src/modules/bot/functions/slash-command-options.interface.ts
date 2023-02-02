import { ApplicationCommandOptionType } from 'discord.js';


export interface SlashCommandOption {
    name: string;
    description: string;
    type: ApplicationCommandOptionType;
    required?: boolean;
    autocomplete?: boolean;
    choices?: Choice[];
}

export interface Choice {
    name: string;
    value: string;
}
