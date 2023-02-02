import { Bot } from '../classes/bot.class';
import { intents } from '../default/bot-intents.default';
import { MusicCommands } from '../classes/music/music-commands.class';


export class ServerBot extends Bot {

    #musicPlayer: MusicCommands;

    get musicPlayer(): MusicCommands {
        return this.#musicPlayer;
    }

    constructor() {
        super({
            intents
        });
        this.#musicPlayer = new MusicCommands(this);
    }
}
