import { Server, Socket } from "socket.io";
import { Message } from "../utils/message";
import EventHelper from "../helpers/EventHelper";

class EventManager {
  public static onConnection(socket: Socket) {
    console.log('[Event] New client was connected: %s', socket.id);
  }

  public static onDisconnection(socket: Socket) {
    console.log('[Event] Client just disconnected: ', socket.id);
    EventHelper.removePlayerEvent(socket);
  }

  public static onMessage(io: Server, socket: Socket, m: any) {
    const message: Message = Message.getMessageFromObject(m);
    console.log("[Event] Message arrived: ", message);

    switch (message.getType()) {
      case 'CREATE_GAME':
        EventHelper.createGameEvent(message, socket, io);
        break;
      case 'JOIN_GAME':
        EventHelper.joinGameEvent(message, socket, io);
        break;
      case 'MAKE_MOVE':
        EventHelper.makeMoveEvent(message, socket, io);
        break;
      case 'REMOVE_PLAYER':
        EventHelper.removePlayerEvent(socket);
        break;
      default:
        break;
    }
  }
}

export default EventManager;