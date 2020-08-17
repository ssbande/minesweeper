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
 * @param name Name of the player who launched the game
 * @param localPlayerId Unique ID of the player to be identified irrespective of the id
 */
export const createPlayer = (currentLength: number, name: string, localPlayerId): IPlayer => ({
	id: currentLength.toString(),
	name,
	localId: localPlayerId,
	flagCount: 0,
	flagPositions: [],
	isWinner: false,
	avatarId: Math.floor(Math.random() * 10)
})
