import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import * as sockets from '../sockets/sockets';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpserver: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpserver = new http.Server(this.app);
        this.io = socketIO(this.httpserver);
        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {

        console.log('Escuchando sockets');
        this.io.on('connection', cliente => {

            // Conectar Cliente
            sockets.conectarCLiente( cliente );

            // Configurando usuario
            sockets.configurarUsuario(cliente, this.io);
            
            // Mensajes
            sockets.mensaje(cliente, this.io);

            // Desconectar
            sockets.desconectar(cliente);

        });
    }

    start(callback: Function) {

        this.httpserver.listen(this.port);

    }


}