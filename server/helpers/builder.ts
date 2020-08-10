import { GameScene, IPlayer } from './contracts'
import Constants from './constants'

/**
 * Helper method to create an error response which would have a 
 * detailed error message and a key to identify for what the message was for
 * @param name ref value for which to choose the error message
 */
export const errorResponse = (name?: string | GameScene) => {
	const errorName = !!name ? name.toString() : 'FALLBACK_ERROR_MESSAGE'
	return {
		error: errorName,
		message: Constants.ErrorMessages[errorName],
	}
}

/**
 * creates a player to be added in the game 
 * @param currentLength number of players joined the game (0-based count)
 */
export const createPlayer = (currentLength: number): IPlayer => ({
	id: currentLength.toString(),
	name: `Player ${currentLength + 1}`,
	flagCount: 0,
	flagPositions: [],
	isWinner: false,
})
