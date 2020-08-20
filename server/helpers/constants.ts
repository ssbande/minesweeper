export default {
	MaxPlayers: 2,
	ErrorMessages: {
		FALLBACK_ERROR_MESSAGE: 'Something has gone wrong. Please try again later',
		GAME_NOT_FOUND:
			'We could not find the game you are trying to connect with. Please check the details.',
		PLAYER_EXCEEDING:
			'Number of players required to start have already joined the game. Please try again after some time',
		PLAYER_NOT_FOUND:
			'The player is not associated with the game provided. Please check the details.',
		QUERYING_OLD_GAME:
			'This game session has been expired. Please start a new game to play again.',
		BAD_REQUEST:
			'The request was in an invalid format. Please check the request body',
		GAME_NOT_STARTED:
			'The game has not yet started. Please wait for all players to join.',
		NOT_YOUR_TURN: 'Please wait for you turn.',
		CANT_ALTER_OTHERS_FLAG:
			'You are not allowed to alter the flag marked by other players',
		UNMARK_WITH_RIGHT_CLICK:
			'Right click on the cell to unmark it',
		DIG_DUG_CELL: 
			'Click on a cell which is not yet digged ... '
	},
	GameLevelConfig: {
		DEFAULT: { maxRows: 5, maxCols: 5, noOfBombs: 4 },
		BEGINNER: { maxRows: 9, maxCols: 9, noOfBombs: 10 },
		INTERMEDIATE: { maxRows: 16, maxCols: 16, noOfBombs: 40 },
		EXPERT: { maxRows: 16, maxCols: 30, noOfBombs: 99 },
	},
	dx: [-1, 0, 1, -1, 1, -1, 0, 1],
	dy: [-1, -1, -1, 0, 0, 1, 1, 1],
}
