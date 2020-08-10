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

export const createGame = () => (dispatch: Dispatch) => {
	const url = resolveUri(Constants.apiEndpoints.createGame)({
		level: 'BEGINNER',
	})
	AppUtils.executeFetch(url, { method: 'POST' })
		.then(gameDetails =>
			dispatch({ type: CREATE_GAME.SUCCESS, payload: gameDetails })
		)
		.catch(error => dispatch({ type: CREATE_GAME.ERROR, payload: error }))
}

export const joinGame = (gameId: string) => (dispatch: Dispatch) => {
	const url = resolveUri(Constants.apiEndpoints.joinGame)({ gameId })
	AppUtils.executeFetch(url, { method: 'PUT' })
		.then(gameDetails =>
			dispatch({ type: JOIN_GAME.SUCCESS, payload: gameDetails })
		)
		.catch(error => dispatch({ type: JOIN_GAME.ERROR, payload: error }))
}

export const removePlayer = (gameId: string, playerId: string) => (
	dispatch: Dispatch
) => {
	const url = resolveUri(Constants.apiEndpoints.removePlayer)({
		gameId,
		id: playerId,
	})
	AppUtils.executeFetch(url, { method: 'DELETE' })
		.then(gameDetails =>
			dispatch({ type: REMOVE_PLAYER.SUCCESS, payload: gameDetails })
		)
		.catch(error => dispatch({ type: REMOVE_PLAYER.ERROR, payload: error }))
}

export const makeMove = (
	gameId: string,
	playerId: string,
	rowIndex: number,
	colIndex: number,
	isContextClick: boolean
) => (dispatch: Dispatch) => {
	const url = resolveUri(Constants.apiEndpoints.makeMove)({ gameId })
	AppUtils.executeFetch(url, {
		method: 'PUT',
		body: JSON.stringify({ playerId, rowIndex, colIndex, isContextClick }),
	})
		.then(gameDetails =>
			dispatch({ type: MAKE_MOVE.SUCCESS, payload: gameDetails })
		)
		.catch(error => dispatch({ type: MAKE_MOVE.ERROR, payload: error }))
}

export const removeErrorFromStore = () => (dispatch: Dispatch) => {
	dispatch({ type: REMOVE_ERROR_FROM_STORE })
}

export const handleStorageChange = (e: any) => (dispatch: Dispatch) => {
	if (e.key === 'game') {
		const oldValue = JSON.parse(e.oldValue)
		const newValue = JSON.parse(e.newValue)
		if (!!newValue) {
			dispatch({ type: STORAGE_CHANGE, payload: { oldValue, newValue } })
		}
	}
	if (e.key === 'removePlayerId') {
		dispatch({ type: REMOVE_LOCAL_PLAYER, payload: { playerId: e.newValue } })
	}
}
