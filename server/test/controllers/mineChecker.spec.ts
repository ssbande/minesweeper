import MineChecker from '../../controllers/mineChecker'
import { IGameDocument } from '../../game'
import { GameState, GameScene } from '../../helpers/contracts'
import MineField from '../../controllers/mineField'
import { createPlayer } from '../../helpers/builder'
import mineChecker from '../../controllers/mineChecker'

beforeEach(() => {})

describe('MineChecker', () => {
	it('should be able to check game result by flags', () => {
		const mineField = new MineField()
		const game = {
			gameId: 'TestGameID',
			state: GameState.RUNNING,
			turn: 0,
			totalMarkedFlags: 0,
			judge: GameScene.KEEP_RUNNING,
			players: [createPlayer(0), createPlayer(1)],
			mineField: mineField.createNewBoard(),
		} as IGameDocument
		game.players[0].flagPositions = [
			{ markedRow: 0, markedCol: 0, isValidBomb: true },
			{ markedRow: 0, markedCol: 1, isValidBomb: true },
			{ markedRow: 0, markedCol: 2, isValidBomb: true },
		]

		game.players[1].flagPositions = [
			{ markedRow: 1, markedCol: 0, isValidBomb: true },
			{ markedRow: 1, markedCol: 1, isValidBomb: true },
			{ markedRow: 1, markedCol: 2, isValidBomb: true },
			{ markedRow: 1, markedCol: 3, isValidBomb: true },
		]

		const newGame = mineChecker.checkGameResultByFlags(game)
		expect(newGame.players[1].isWinner).toBeTruthy()
		expect(newGame.judge).toBe(GameScene['1_WON'])
	})
})
