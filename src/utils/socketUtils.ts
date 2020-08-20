import { IData, GameLevel, IGame } from "./contracts";

// Emitting types to sockets 
export enum OutputMessageType {
  CREATE_GAME = 'CREATE_GAME',
  JOIN_GAME = 'JOIN_GAME',
  MAKE_MOVE = 'MAKE_MOVE',
  REMOVE_PLAYER = 'REMOVE_PLAYER'
}

// Types being received from sockets
export enum InputMessageType {
  GAME_CREATED = 'GAME_CREATED',
  GAME_JOINED = 'GAME_JOINED',
  PLAYER2_JOINED = 'PLAYER2_JOINED',
  MADE_MOVE = 'MADE_MOVE',
  REMOVED_PLAYER = 'REMOVED_PLAYER',
  ERROR = 'ERROR',
}

export interface ISocketCreateGame {
  gameLevel: GameLevel
  name: string
}

export interface ISocketJoinGame {
  joiningGameId: string
  name: string
}

export interface ISocketMakeMove {
  gameId: string,
  playerId: string,
  rowIndex: number,
  colIndex: number,
  isContextClick: boolean
}

export interface ISocketRemovePlayer {
  gameId: string,
  playerId: string
}

export interface ISocketError {
  playerId: string
  error: string,
  message: string
}

export type MessageType = InputMessageType | OutputMessageType;
export type InputMessage = IGame | ISocketError;
export type OutputMessage = ISocketCreateGame
  | ISocketJoinGame
  | ISocketMakeMove
  | ISocketRemovePlayer;

export type MessagePayload = InputMessage | OutputMessage;

export class Message {
  public static getMessageFromObject(input: IData): Message {
    return new Message(input["type"], input["payload"]);
  }

  private type: MessageType;
  private payload?: MessagePayload;

  constructor(type: MessageType, payload?: MessagePayload, sender?: any) {
    this.type = type;

    if (payload) {
      this.payload = payload;
    }
  }

  public getType(): MessageType {
    return this.type;
  }

  public getPayload(): MessagePayload | undefined {
    return this.payload;
  }
}