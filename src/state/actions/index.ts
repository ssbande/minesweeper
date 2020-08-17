import { Dispatch } from 'redux'
import AppUtils from '../../utils/appUtils'
import { resolveUri } from '../../utils/helpers'
import Constants from '../../utils/constants'
import {
	CREATE_GAME,
	JOIN_GAME,
	STORAGE_CHANGE,
	REMOVE_PLAYER,
	REMOVE_LOCAL_PLAYER,
	MAKE_MOVE,
	REMOVE_ERROR_FROM_STORE,
} from '../actionTypes'
import { GameLevel } from '../../utils/contracts'
import { Message } from '../../utils/socketUtils'
// import { Message } from '../../utils/socketUtils'
// import { IOnWaitingOpponent, ActionType } from './contracts'

//INPUT ACTIONS
export const createGame = (level: GameLevel, name: string) => (dispatch: Dispatch) => {
	console.log('start game creation ... ')
	return new Promise((resolve, reject) => {
		try {
			dispatch({type: 'CREATE_GAME', payload: {level, name}})
			return resolve(true)
		} catch (error) {
			return reject(false)
		}
	})
}

export const joinGame = (gameId: string, name: string) => (dispatch: Dispatch) => {
	return new Promise((resolve, reject) => {
		try {
			dispatch({type: 'JOIN_GAME', payload: {gameId, name}})
			return resolve(true)
		} catch (error) {
			return reject(false)
		}
	})
}

export const removeErrorFromStore = () => (dispatch: Dispatch) => {
	dispatch({ type: REMOVE_ERROR_FROM_STORE })
}

// SOCKET RESPONSE ACTIONS		
export const onGameCreated = (m: Message) => (dispatch: Dispatch) => {
	console.log('type: ', m.getType());
	dispatch({ type: 'GAME_CREATED', payload: m.getPayload() })
}
export const onGameJoined = (m: Message) => (dispatch: Dispatch) => {
	console.log('type: ', m.getType());
	dispatch({ type: 'GAME_JOINED', payload: m.getPayload() })
}
export const onPlayer2Joined = (m: Message) => (dispatch: Dispatch) => {
	console.log('type: ', m.getType());
	dispatch({ type: 'PLAYER2_JOINED', payload: m.getPayload() })
}
export const onMoveMade = (m: Message) => (dispatch: Dispatch) => {
	console.log('type: ', m.getType());
	dispatch({ type: 'UPDATE_GAME', payload: m.getPayload() })
}
export const onPlayerRemoved = (m: Message) => (dispatch: Dispatch) => {
	console.log('type: ', m.getType());
	dispatch({ type: 'UPDATE_GAME', payload: m.getPayload() })
}
export const onError = (m: Message) => (dispatch: Dispatch) => {
	console.log('type: ', m.getType());
	dispatch({ type: 'UPDATE_ERROR', payload: m.getPayload() })
}



// export const createGame = () => (dispatch: Dispatch) => {
// 	const url = resolveUri(Constants.apiEndpoints.createGame)({
// 		level: 'DEFAULT',
// 	})
// 	AppUtils.executeFetch(url, { method: 'POST' })
// 		.then(gameDetails =>
// 			dispatch({ type: CREATE_GAME.SUCCESS, payload: gameDetails })
// 		)
// 		.catch(error => dispatch({ type: CREATE_GAME.ERROR, payload: error }))
// }

// export const joinGame = (gameId: string) => (dispatch: Dispatch) => {
// 	const url = resolveUri(Constants.apiEndpoints.joinGame)({ gameId })
// 	AppUtils.executeFetch(url, { method: 'PUT' })
// 		.then(gameDetails =>
// 			dispatch({ type: JOIN_GAME.SUCCESS, payload: gameDetails })
// 		)
// 		.catch(error => dispatch({ type: JOIN_GAME.ERROR, payload: error }))
// }

// export const removePlayer = (gameId: string, playerId: string) => (
// 	dispatch: Dispatch
// ) => {
// 	const url = resolveUri(Constants.apiEndpoints.removePlayer)({
// 		gameId,
// 		id: playerId,
// 	})
// 	AppUtils.executeFetch(url, { method: 'DELETE' })
// 		.then(gameDetails =>
// 			dispatch({ type: REMOVE_PLAYER.SUCCESS, payload: gameDetails })
// 		)
// 		.catch(error => dispatch({ type: REMOVE_PLAYER.ERROR, payload: error }))
// }

// export const makeMove = (
// 	gameId: string,
// 	playerId: string,
// 	rowIndex: number,
// 	colIndex: number,
// 	isContextClick: boolean
// ) => (dispatch: Dispatch) => {
// 	const url = resolveUri(Constants.apiEndpoints.makeMove)({ gameId })
// 	AppUtils.executeFetch(url, {
// 		method: 'PUT',
// 		body: JSON.stringify({ playerId, rowIndex, colIndex, isContextClick }),
// 	})
// 		.then(gameDetails =>
// 			dispatch({ type: MAKE_MOVE.SUCCESS, payload: gameDetails })
// 		)
// 		.catch(error => dispatch({ type: MAKE_MOVE.ERROR, payload: error }))
// }



// export const handleStorageChange = (e: any) => (dispatch: Dispatch) => {
// 	if (e.key === 'game') {
// 		const oldValue = JSON.parse(e.oldValue)
// 		const newValue = JSON.parse(e.newValue)
// 		if (!!newValue) {
// 			dispatch({ type: STORAGE_CHANGE, payload: { oldValue, newValue } })
// 		}
// 	}
// 	if (e.key === 'removePlayerId') {
// 		dispatch({ type: REMOVE_LOCAL_PLAYER, payload: { playerId: e.newValue } })
// 	}
// }