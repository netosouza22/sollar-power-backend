"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.configuration();
        this.routes();
    }
    //configure the port
    configuration() {
        this.app.set('port', 3001);
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.send("hello world");
        });
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('running');
        });
    }
}
const server = new Server();
server.start();
