import { IGameDocument } from '../game'
import { GameScene, CellValue, CellState } from '../helpers/contracts'

class MineChecker {
	/**
	 * Checks and identifies winner on the basis of flags, when all the flags 
	 * as per the game level have been utilised. 
	 * It checks for the valid Flags (hiding bombs) which are marked by players 
	 * The player which has idenified more number of bombs correctly, is the winner. 
	 * Also explode all the bomb cells, to show the bomb positions
	 * @param game: Current game instance 
	 */
	public checkGameResultByFlags(game: IGameDocument): IGameDocument {
		const player1ValidFlags = game.players[0].flagPositions.filter(
			pos => pos.isValidBomb
		).length
		const player2ValidFlags = game.players[1].flagPositions.filter(
			pos => pos.isValidBomb
		).length

		const winnerId = player1ValidFlags > player2ValidFlags ? 0 : 1
		game.players[winnerId].isWinner = true
		game.judge = winnerId === 0 ? GameScene['0_WON'] : GameScene['1_WON']
		
		for (let r = 0; r < game.mineField.field.length; r++) {
			const row = game.mineField.field[r]
			for (let c = 0; c < row.length; c++) {
				if (game.mineField.field[r][c].value === CellValue.BOMB) {
					game.mineField.field[r][c].state = CellState.DUG
				}
			}
		}
		
		return game
	}
}

export default new MineChecker()
