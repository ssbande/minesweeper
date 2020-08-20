export interface IData {
	[key: string]: any
}

export interface IApiOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers?: IData
	body?: string
}

export enum OutputMessageType {
  GAME_CREATED = 'GAME_CREATED',
  GAME_JOINED = 'GAME_JOINED',
  PLAYER2_JOINED = 'PLAYER2_JOINED',
  MADE_MOVE = 'MADE_MOVE',
  REMOVED_PLAYER = 'REMOVED_PLAYER',
  ERROR = 'ERROR',
}