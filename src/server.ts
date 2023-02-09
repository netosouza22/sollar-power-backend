import express, { Request, Response } from 'express';

class Server{
    private app: express.Application;

    constructor() {
        this.app = express();
        this.configuration();
        this.routes();
    }

    //configure the port
    public configuration() {
        this.app.set('port', 3001);
    }

    public routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send("hello world")
        })
    }

    public start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('running')
        })
    }
}

const server = new Server();
server.start();