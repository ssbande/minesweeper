import { Dispatch } from 'redux';
import {
	REMOVE_ERROR_FROM_STORE,
	JOIN_GAME,
	CREATE_GAME,
	LEAVE_GAME,
} from '../actionTypes';
import { GameLevel } from '../../utils/contracts';
import { Message, InputMessageType } from '../../utils/socketUtils';

//INPUT ACTIONS
export const createGame = (level: GameLevel, name: string) => (dispatch: Dispatch) => {
	return new Promise((resolve, reject) => {
		try {
			dispatch({ type: CREATE_GAME, payload: { level, name } })
			return resolve(true)
		} catch (error) {
			return reject(false)
		}
	})
}

export const joinGame = (gameId: string, name: string) => (dispatch: Dispatch) => {
	return new Promise((resolve, reject) => {
		try {
			dispatch({ type: JOIN_GAME, payload: { gameId, name } })
			return resolve(true)
		} catch (error) {
			return reject(false)
		}
	})
}

export const leaveGame = (localId: string) => (dispatch: Dispatch) => {
	dispatch({ type: LEAVE_GAME, payload: { localId } })
}

export const removeErrorFromStore = () => (dispatch: Dispatch) => {
	dispatch({ type: REMOVE_ERROR_FROM_STORE })
}

// SOCKET RESPONSE ACTIONS		
export const onGameCreated = (m: Message) => (dispatch: Dispatch) => {
	dispatch({ type: InputMessageType.GAME_CREATED, payload: m.getPayload() })
}
export const onGameJoined = (m: Message) => (dispatch: Dispatch) => {
	dispatch({ type: InputMessageType.GAME_JOINED, payload: m.getPayload() })
}
export const onPlayer2Joined = (m: Message) => (dispatch: Dispatch) => {
	dispatch({ type: InputMessageType.PLAYER2_JOINED, payload: m.getPayload() })
}
export const onMoveMade = (m: Message) => (dispatch: Dispatch) => {
	dispatch({ type: InputMessageType.MADE_MOVE, payload: m.getPayload() })
}
export const onPlayerRemoved = (m: Message) => (dispatch: Dispatch) => {
	dispatch({ type: InputMessageType.REMOVED_PLAYER, payload: m.getPayload() })
}
export const onError = (m: Message) => (dispatch: Dispatch) => {
	dispatch({ type: InputMessageType.ERROR, payload: m.getPayload() })
}