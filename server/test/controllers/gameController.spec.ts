import * as gameController from '../../controllers/gameController'
import Game, { IGameDocument } from '../../game'
import mockingoose from 'mockingoose'
import MineField from '../../controllers/mineField'
import { GameState, GameScene, GameLevel } from '../../helpers/contracts'
import { createPlayer } from '../../helpers/builder'

describe('Create / Join a game', () => {
	let request: any
	let response: any
	let mockDoc: any
	afterEach(() => {
		mockingoose(Game).reset()
	})
	beforeEach(() => {
		request = {
			params: { gameId: 'testGameId' },
			body: {
				playerId: '0',
				rowIndex: 0,
				colIndex: 0,
				isContextClick: false,
			},
		}
		response = { status: () => response, send: jest.fn() }
		const field = new MineField().createNewBoard(GameLevel.DEFAULT)
		mockDoc = {
			gameId: 'testGameId',
			state: GameState.RUNNING,
			turn: 0,
			totalMarkedFlags: 0,
			judge: GameScene.KEEP_RUNNING,
			players: [createPlayer(0), createPlayer(1)],
			mineField: field,
			save: jest.fn(),
		}
	})

	xit('should allow to create a new game', () => {})
	xit('should allow users to join a game with vacancy', () => {})
	it('should block users to join a game with no vacancy', async () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		await gameController.join(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'PLAYER_EXCEEDING',
			message:
				'Number of players required to start have already joined the game. Please try again after some time',
		})
	})
	it('should block users to join an invalid game', async () => {
		mockingoose(Game).toReturn(null, 'findOne')
		await gameController.join(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'GAME_NOT_FOUND',
			message:
				'We could not find the game you are trying to connect with. Please check the details.',
		})
	})
	it('should block users to join an old game', async () => {
		mockDoc.state = GameState.OVER
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		await gameController.join(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'QUERYING_OLD_GAME',
			message:
				'This game session has been expired. Please check for the current game session',
		})
	})
})

describe('Info & Status', () => {
	let request: any
	let response: any
	let mockDoc: any
	afterEach(() => {
		mockingoose(Game).reset()
	})
	beforeEach(() => {
		request = {
			params: { gameId: 'testGameId' },
			body: {
				playerId: '0',
				rowIndex: 0,
				colIndex: 0,
				isContextClick: false,
			},
		}
		response = { status: () => response, send: jest.fn() }
		const field = new MineField().createNewBoard(GameLevel.DEFAULT)
		mockDoc = {
			gameId: 'testGameId',
			state: GameState.RUNNING,
			turn: 0,
			totalMarkedFlags: 0,
			judge: GameScene.KEEP_RUNNING,
			players: [createPlayer(0), createPlayer(1)],
			mineField: field,
		}
	})

	it('should allow users to check for the status', () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		gameController.checkStatus(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			gameId: 'testGameId',
			newStatus: 'RUNNING',
		})
	})
	it('should allow users to check status for old game', () => {
		mockDoc.state = GameState.OVER
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		gameController.checkStatus(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			gameId: 'testGameId',
			newStatus: 'OVER',
		})
	})
	it('should allow users to get info of the current game', () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		gameController.getInfo(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
	})
	it('should block users to get info of old game', () => {
		mockDoc.state = GameState.OVER
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		gameController.getInfo(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'QUERYING_OLD_GAME',
			message:
				'This game session has been expired. Please check for the current game session',
		})
	})
})

describe('Make move', () => {
	let request: any
	let response: any
	let mockDoc: any
	afterEach(() => {
		mockingoose(Game).reset()
	})
	beforeEach(() => {
		request = {
			params: { gameId: 'testGameId' },
			body: {
				playerId: '0',
				rowIndex: 0,
				colIndex: 0,
				isContextClick: false,
			},
		}
		response = { status: () => response, send: jest.fn() }
		const field = new MineField().createNewBoard(GameLevel.DEFAULT)
		mockDoc = {
			gameId: 'testGameId',
			state: GameState.RUNNING,
			turn: 0,
			totalMarkedFlags: 0,
			judge: GameScene.KEEP_RUNNING,
			players: [createPlayer(0), createPlayer(1)],
			mineField: field,
		}
	})

	it('should block users to make move in an invalid game', async () => {
		mockingoose(Game).toReturn(null, 'findOne')
		await gameController.makeMove(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'GAME_NOT_FOUND',
			message:
				'We could not find the game you are trying to connect with. Please check the details.',
		})
	})
	it('should block users to make move in an old game', async () => {
		mockDoc.state = GameState.OVER
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		await gameController.makeMove(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'QUERYING_OLD_GAME',
			message:
				'This game session has been expired. Please check for the current game session',
		})
	})
	it('should block users to make move in a game which is not started', async () => {
		mockDoc.state = GameState.PREPARING
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		await gameController.makeMove(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'GAME_NOT_STARTED',
			message:
				'The game has not yet started. Please wait for all players to join.',
		})
	})
	it('should block users to make move for an invalid player', async () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		request.body.playerId = '3'
		await gameController.makeMove(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'BAD_REQUEST',
			message:
				'The request was in an invalid format. Please check the request body',
		})
	})
	it('should block users to make move when its not their turn', async () => {
		mockDoc.turn = 1
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		await gameController.makeMove(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'NOT_YOUR_TURN',
			message: 'Please wait for you turn.',
		})
	})
	it('should block users to make a move with an invalid request', async () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		delete request.body.rowIndex
		await gameController.makeMove(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'BAD_REQUEST',
			message:
				'The request was in an invalid format. Please check the request body',
		})
	})
	xit('should allow users to mark a cell as FLAGGED', () => {})
	xit('should allow users to UNFLAG a cell', () => {})
	xit('should end the game when a BOMB cell is DUG', () => {})
	xit('should allow users to open a zero-untouched cell', () => {})
	xit('should allow users to open a non-zero untouched cell', () => {})
})

describe('Remove Player', () => {
	let request: any
	let response: any
	let mockDoc: IGameDocument
	beforeEach(() => {
		request = { params: { gameId: 'testGameId', id: '0' } }
		response = { status: () => response, send: jest.fn() }
		mockDoc = {
			gameId: 'testGameId',
			state: GameState.PREPARING,
			turn: 0,
			totalMarkedFlags: 0,
			judge: GameScene.KEEP_RUNNING,
			players: [createPlayer(0), createPlayer(1)],
			mineField: new MineField().createNewBoard(GameLevel.DEFAULT),
			save: jest.fn(),
		} as any
	})

	it('should allow users to remove a player from the game', async () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')

		await gameController.removePlayer(request, response)
		setTimeout(() => {
			expect(response.send).toBeCalled()
		}, 1000)
	})
	it('should block users to remove player from an old game', async () => {
		mockDoc.state = GameState.OVER
		mockingoose(Game).toReturn(mockDoc, 'findOne')

		await gameController.removePlayer(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'QUERYING_OLD_GAME',
			message:
				'This game session has been expired. Please check for the current game session',
		})
	})
	it('should block users to remove player from an invald game', async () => {
		mockingoose(Game).toReturn(null, 'findOne')

		await gameController.removePlayer(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'GAME_NOT_FOUND',
			message:
				'We could not find the game you are trying to connect with. Please check the details.',
		})
	})
	it('should block users to remove player which is not associated with the game', async () => {
		mockingoose(Game).toReturn(mockDoc, 'findOne')
		request.params.id = 'test'

		await gameController.removePlayer(request, response)
		expect(response.send).toBeCalled()
		expect(response.send).toBeCalledTimes(1)
		expect(response.send).toBeCalledWith({
			error: 'PLAYER_NOT_FOUND',
			message:
				'The player is not associated with the game provided. Please check the details.',
		})
	})
})
