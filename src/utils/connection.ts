import socketIo from 'socket.io-client';
import constants from './constants';
import { Message } from './socketUtils';

class ConnectionManager {
  private socket: SocketIOClient.Socket;
  private id: string;

  constructor() {
    this.socket = socketIo(constants.socketUrl);
    this.id = this.socket.id;
  }

  public send(m: Message) {
    this.socket.emit('message', m);
  }

  public subscribe(callback: (m: Message) => void) {
    this.socket.on('message', (m: object) => {
      callback(Message.getMessageFromObject(m));
    });
  }

  public getId(): string {
    return this.id;
  }
}

export default ConnectionManager;