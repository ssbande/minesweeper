import { Server, Socket } from "socket.io";
import { Message } from "../utils/message";
import EventHelper from "./EventHelper";

class EventManager {
  public static onConnection(socket: Socket) {
    console.log('[Event] New client was connected: %s', socket.id);
  }

  public static onDisconnection(socket: Socket) {
    console.log('[Event] Client just disconnected: %s', socket.id);
    console.log('call the remove player API here and then send the response ... ');
    EventHelper.removePlayerEvent(socket);
  }

  public static onMessage(io: Server, socket: Socket, m: any) {
    const message: Message = Message.getMessageFromObject(m);

    console.log("[Event] Message arrived: ", message);

    switch (message.getType()) {
      case 'CREATE_GAME':
        console.log('call the create game API here and then send the response ... ');
        EventHelper.createGameEvent(message, socket, io);
        break;
      case 'JOIN_GAME':
        console.log('call the join game API here and then send the response ... ');
        EventHelper.joinGameEvent(message, socket, io);
        break;
      case 'MAKE_MOVE':
        console.log('call the make move API here and then send the response ... ');
        EventHelper.makeMoveEvent(message, socket, io);
        break;
      default:
        break;
    }
  }
}

export default EventManager;