import { AnyAction } from 'redux'
import { IAppState, IGame, IPlayer } from '../../utils/contracts'
import { createReducer } from 'redux-create-reducer'
import { produce } from 'immer'
import {
	CREATE_GAME,
	JOIN_GAME,
	STORAGE_CHANGE,
	REMOVE_PLAYER,
	REMOVE_LOCAL_PLAYER,
	MAKE_MOVE,
	REMOVE_ERROR_FROM_STORE,
} from '../actionTypes'

const initialState: IAppState = {
	game: {} as IGame,
	me: {} as IPlayer,
	removePlayer: false,
	removePlayerId: undefined,
	error: undefined,
}

const handlers = {
	[CREATE_GAME.SUCCESS]: (state: IAppState, action: AnyAction) => {
		localStorage.setItem('game', JSON.stringify(action.payload))
		return produce(state, draft => {
			draft.game = action.payload
			draft.me = action.payload.players[0]
			draft.error = undefined
		})
	},
	[JOIN_GAME.SUCCESS]: (state: IAppState, action: AnyAction) => {
		localStorage.setItem('game', JSON.stringify(action.payload))
		return produce(state, draft => {
			draft.game = action.payload
			draft.me = action.payload.players[1]
			draft.error = undefined
		})
	},
	[JOIN_GAME.ERROR]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.error = action.payload
		})
	},
	[REMOVE_PLAYER.SUCCESS]: (state: IAppState, action: AnyAction) => {
		localStorage.removeItem('removePlayerId')
		localStorage.setItem('game', JSON.stringify(action.payload))
		return produce(state, draft => {
			draft.game = action.payload
			draft.removePlayer = false
			draft.removePlayerId = undefined
			draft.error = undefined
		})
	},
	[REMOVE_LOCAL_PLAYER]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.removePlayer = true
			draft.removePlayerId = action.payload.playerId
			draft.error = undefined
		})
	},
	[MAKE_MOVE.SUCCESS]: (state: IAppState, action: AnyAction) => {
		localStorage.setItem('game', JSON.stringify(action.payload))
		return produce(state, draft => {
			draft.game = action.payload
			draft.error = undefined
		})
	},
	[MAKE_MOVE.ERROR]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.error = action.payload
		})
	},
	[REMOVE_ERROR_FROM_STORE]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.error = undefined
		})
	},
	[STORAGE_CHANGE]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.game = action.payload.newValue
		})
	},
}

export default createReducer(initialState, handlers)
