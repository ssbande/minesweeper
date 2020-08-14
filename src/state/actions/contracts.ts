import { Message } from "../../utils/socketUtils";

export enum ActionType {
  CREATE_GAME = 'CREATE_GAME',
  MARK_MODE = 'MARK_MODE',
  CHECK_BOARD = 'CHECK_BOARD',
  RESTART = 'RESTART',
  BOARD_UPDATE = 'BOARD_UPDATE',
  WAITING_OPPONENT = 'ON_WAITING_OPPONENT',
  ON_GAME_ESTABLISHED = 'ON_GAME_ESTABLISHED',
  ON_GAME_ERROR = 'ON_GAME_ERROR'
}

export interface IOnWaitingOpponent {
  type: ActionType.WAITING_OPPONENT,
  message: Message
}
