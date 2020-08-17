import { AnyAction } from 'redux'
import { IAppState, IGame, IPlayer, GameLevel, GameType } from '../../utils/contracts'
import { createReducer } from 'redux-create-reducer'
import { produce } from 'immer'
import { CREATE_GAME, JOIN_GAME } from '../actionTypes'
import { InputMessageType } from '../../utils/socketUtils'

const initialState: IAppState = {
	game: {} as IGame,
	me: {} as IPlayer,
	error: undefined,
	gameLevel: '' as GameLevel,
	gameType: '' as GameType,
	joiningGameId: ''
}

const handlers = {
	[CREATE_GAME]: (state: IAppState, action: AnyAction) => {
		const { level, name } = action.payload;
		return produce(state, draft => {
			draft.gameLevel = level
			draft.gameType = GameType.NEW
			draft.me.name = name; 
			draft.error = undefined
		})
	},
	[JOIN_GAME]: (state: IAppState, action: AnyAction) => {
		const { gameId, name } = action.payload;
		return produce(state, draft => {
			draft.joiningGameId = gameId
			draft.me.name = name; 
			draft.gameType = GameType.JOIN
			draft.error = undefined
		})
	},
	[InputMessageType.GAME_CREATED]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.game = action.payload; 
			draft.me = action.payload.players[0]
			draft.error = undefined
		})
	},
	[InputMessageType.GAME_JOINED]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.game = action.payload; 
			draft.error = undefined
		})
	},
	[InputMessageType.PLAYER2_JOINED]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.me = action.payload
			draft.error = undefined
		})
	},
	[InputMessageType.MADE_MOVE]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.game = action.payload; 
			draft.error = undefined
		})
	},
	[InputMessageType.REMOVED_PLAYER]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.game = action.payload; 
			draft.error = undefined
		})
	},
	[InputMessageType.ERROR]: (state: IAppState, action: AnyAction) => {
		return produce(state, draft => {
			draft.error = action.payload
		})
	}
}

export default createReducer(initialState, handlers)
