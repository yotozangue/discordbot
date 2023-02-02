// App
import express from 'express';
import { createServer, Server } from 'http';

// middlewares
import cors from 'cors';
import consola from 'consola';

// database
//import connect from './modules/database';
import { Advice, UseAspect } from '@arekushii/ts-aspect';
import { ExceptionActionAspect } from './core/aspects/exception-action.aspect';

export class App {

    app: express.Application;
    server: Server;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.middlewares();
        this.cors();
        this.routes();
        this.database();
    }

    public start(): void {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            consola.success(`[Application] Node Express Server starting on http://localhost:${port}`);
        });
    }

    private middlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false
        }));
    }

    private cors(): void {
        const options: cors.CorsOptions = {
            methods: '*',
            origin: '*'
        };
        this.app.use(cors(options));
    }

    @UseAspect(Advice.TryCatch, ExceptionActionAspect)
    private async database(): Promise<void> {
        //const db = await connect();
        //this.app.locals.db = db;
    }


    private routes(): void {
        //this.#app.use('/', indexRoutes);
    }

}
