import { Server, Socket } from "socket.io";
import { Message } from "../utils/message";
import { resolveUri } from "./ApiHelper";
import constants from '../utils/constants'
import ApiManager from './ApiManager';
import GameManager from "./GameManager";
import getManager from ".";

export default class EventHelper {
  private static games: GameManager = getManager().getGameManager();
  
  static createGameEvent(message: Message, socket: Socket, io: Server) {
    const data = message.getPayload();
    const url = resolveUri(constants.apiEndpoints.createGame)({
      level: data.gameLevel
    })

    const body = JSON.stringify({
      name: data.name,
      localPlayerId: socket.id
    })

    ApiManager.executeFetch(url, { method: 'POST', body })
      .then((res: any) => {
        socket.join(res.gameId)
        this.games.addGame(res.gameId)
        this.games.addPlayerToGame(socket.id, res.gameId);
        socket.emit('message', new Message('GAME_CREATED', res))
      })
      .catch((e: any) => console.log('Error in create game: ', e))
  }

  static joinGameEvent(message: Message, socket: Socket, io: Server) {
    const data = message.getPayload();
    const url = resolveUri(constants.apiEndpoints.joinGame)({
      gameId: data.joiningGameId
    })

    const body = JSON.stringify({
      name: data.name,
      localPlayerId: socket.id
    })

    socket.join(data.joiningGameId)
    ApiManager.executeFetch(url, { method: 'PUT', body })
      .then((res: any) => {
        this.games.addPlayerToGame(socket.id, data.joiningGameId);
        io.in(data.joiningGameId).emit('message', new Message('GAME_JOINED', res))
        socket.emit('message', new Message('PLAYER2_JOINED', res.players[1]))
      })
      .catch((e: any) => socket.emit('message', new Message('ERROR', e)))
  }

  static makeMoveEvent(message: Message, socket: Socket, io: Server) {
    const data = message.getPayload();
    const { gameId, playerId, rowIndex, colIndex, isContext } = data;
    const url = resolveUri(constants.apiEndpoints.makeMove)({
      gameId: gameId
    })

    const body = JSON.stringify({ 
      playerId, 
      rowIndex, 
      colIndex, 
      isContextClick: isContext
    })

    ApiManager.executeFetch(url, { method: 'PUT', body })
      .then((res: any) => {
        io.in(data.gameId).emit('message', new Message('MADE_MOVE', res))
      })
      .catch((e: any) => socket.emit('message', new Message('ERROR', e)))
  }

  static removePlayerEvent(socket: Socket) {
    const gameId = this.games.findGameByPlayerSocketId(socket.id);
    console.log('gameId: ', gameId);
    const url = resolveUri(constants.apiEndpoints.removePlayer)({
      gameId,
      id: socket.id
    })

    ApiManager.executeFetch(url, { method: 'DELETE' })
      .then((res: any) => {
        socket.broadcast.emit('message', new Message('REMOVED_PLAYER', res));
        // socket.emit('message', new Message('REMOVED_PLAYER', res))
      })
      .catch((e: any) => console.log('Error in create game: ', e))
  }
}