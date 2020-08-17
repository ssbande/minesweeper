import { createServer, Server } from 'http';
import express from 'express';
import socketIo from 'socket.io';
import EventManager from './managers/EventManager';

class GameServer {
  public static readonly PORT: string = '4000';
  private app: express.Application;
  private server: Server;
  private io: socketIo.Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);

    this.registerServerEvents();
    this.registerServerRoutes();
  }

  private registerServerEvents(): void {
    this.io.on('connect', (socket: socketIo.Socket) => {
      EventManager.onConnection(socket);
      socket.on('message', (m: any) => EventManager.onMessage(this.io, socket, m));
      socket.on('disconnect', () => EventManager.onDisconnection(socket));
    });
  }

  private registerServerRoutes() {
    this.app.get('*', (req, res) => {
      res.send('MineSweeper-SB Server is running! ');
    });
  }

  public listen(): void {
    this.server.listen(parseInt(GameServer.PORT), '0.0.0.0', undefined, () => {
      console.log("[Server] Server starts to listen at port", GameServer.PORT);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default GameServer;