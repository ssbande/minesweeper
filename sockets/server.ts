import { createServer, Server } from 'http';
import express from 'express';
import socketIo from 'socket.io';

class GameServer {
  public static readonly PORT: string = "4000";
  private app: express.Application;
  private server: Server;
  private io: socketIo.Server;
  private port: string | number;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);

    this.registerServerEvents();
    this.registerServerRoutes();
  }

  private registerServerEvents(): void {
    this.io.on('connect', (socket: socketIo.Socket) => {
      console.log('[Event] New client was connected: %s', socket.id);
      // EventManager.onConnection(socket);

      socket.on('message', (m: any) => {
        // EventManager.onMessage(this.io, socket, m);
        console.log('message received: ', m)
        socket.emit('message', m)
      });

      socket.on('disconnect', () => {
        console.log('disconnected', socket.id)
          // EventManager.onDisconnection(socket);
      });
    });
  }

  private registerServerRoutes() {
    this.app.get('*', (req, res) => {
      res.send('Bande, MineSweeper Server is running! ');
    });
  }

  public listen(): void {
    this.server.listen(parseInt(GameServer.PORT), '0.0.0.0', undefined, () => {
      console.log("[Server] Server starts to listen at port %s", GameServer.PORT);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default GameServer;