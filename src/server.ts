import { App } from './app';
import { ServerBot } from './modules/bot/client/serverbot.bot';

export const app = new App();
export const serverBot = new ServerBot();

export const run = async() => {    
    app.start();
    serverBot.init();  
}


