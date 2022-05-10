import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from "./config";
import { Routes } from "./interfaces";
import { HomeRoute } from './routes';
import DB from '../src/databases';

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    public routes: Routes[];

    constructor() {
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 3000;
        this.routes = [
            new HomeRoute()
        ];

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    public listen() {
        try {
            this.app.listen(this.port, (): void => {
                console.log(`Connected successfully on port ${this.port}`);
            });
        } catch(error) {
            console.error(`Error occured: ${error}`);
        }
    }

    private connectToDatabase() {
        DB.sequelize.sync({ force: false });
    }

    private initializeMiddlewares() {
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/static', express.static('static'));
    }

    private initializeRoutes() {
        this.routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
}

export default App;