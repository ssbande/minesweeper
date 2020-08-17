import { Request, Response } from 'express'
import Game, { IGameDocument } from '../game'
import {
	IGame,
	GameState,
	GameScene,
	ApiParent,
} from '../helpers/contracts'
import { errorResponse, createPlayer } from '../helpers/builder'
import { v4 } from 'uuid'
import { validateGame } from '../helpers/validator'
import { rightClickMove, leftClickMove } from '../helpers/moveHelper'
import MineField from '../controllers/mineField'
const minefield = new MineField()

/**
 * Initiates one player for the game to start 
 * Creates the whole mine field with bombs and cell values 
 * based on the config level being passed in the URL parameter
 * @param req: Request received. Level of the game is decided from the 
 * "level" parameters being received in the URL parameter
 * @param res: Gameboard initiated with single player, in waiting state 
 * for the other player to join the game.
 */
export const create = (req: Request, res: Response) => {
	const mineSweeperBoard = minefield.createNewBoard(req.params.level)
	const { name, localPlayerId } = req.body

	const newGame: IGame = {
		gameId: v4(),
		state: GameState.PREPARING,
		turn: 0,
		totalMarkedFlags: 0,
		judge: GameScene.KEEP_RUNNING,
		players: [createPlayer(0, name, localPlayerId)],
		mineField: mineSweeperBoard,
	}

	const game = new Game(newGame)
	game.save((err: any) => {
		const response = err ? err : game
		res.send(response)
	})
}

/**
 * Creates the second player for the game (if all the validation checks are passed)
 * @param req: Request received. Contains the GameID to which the player has to be added
 * @param res: Success / Error Response. If all the checks are passed, the player would be 
 * added to the given game and the state of the game would be changed from PREPARING to RUNNING
 */
export const join = async (req: Request, res: Response) => {
	const newGame = await Game.findOne({ gameId: req.params.gameId }).exec()
	const game = validateGame(ApiParent.JOIN, newGame)
	if (!game.isValid) {
		return res
			.status(401)
			.send(errorResponse(game.error))
	}

	const { name, localPlayerId } = req.body
	newGame.players.push(createPlayer(newGame.players.length, name, localPlayerId))
	newGame.state = GameState.RUNNING
	newGame.save({}, (err, game: IGameDocument) => {
		if (err) {
			res.status(401).send(errorResponse())
		} else res.send(game)
	})
}

/**
 * * REQUEST BODY FORMAT
 * {
 * 		playerId: string,
 * 		rowIndex: number,
 * 		colIndex: number,
 * 		isContextClick: boolean
 * 	}
 * Once all the checks are passed for the game ID, turn and player ID
 * it will proceed with the move logic, otherwise would response back with the error
 * 
 * LOGIC ---------------------------------------------------------------------------
 * RIGHT CLICK ::::::::::
 * 	IF the current cell is already Flagged,
 * 		IF the user who is trying to unFlag the cell(as its already in Flagged state)
 * 		is the one who has marked this cell as Flagged, then change the state to UNTOUCHED
 * 		ELSE send error 
 * 	IF the current cell is not Flagged and not Dug, the mark the cell as Flagged
 * LEFT CLICK ::::::::::
 * 	If someone is trying to left click on a Flagged cell, if it belongs to the same player, 
 * 	instruct to use right click, 
 * 	ELSE throw error 
 * 	IF clicked cell is bomb, mark other player as winner. End the game
 * 	IF clicked cell is 0, dig all the cells until we reach non-zero cells in all direction
 * 	ELSE dig the cell
 * @param req: Request received. Contains the GameID for which the info needs to be fetched 
 * @param res: Success / Error Response depending on the conditions and validations 
 */
export const makeMove = async (req: Request, res: Response) => {
	let newGame = await Game.findOne({ gameId: req.params.gameId }).exec()
	try {
		const { playerId, rowIndex, colIndex, isContextClick } = req.body
		const game = validateGame(ApiParent.MOVE, newGame, playerId);
		if (!game.isValid) {
			return res
				.status(401)
				.send(errorResponse(game.error))
		}

		newGame.turn = 1 - +playerId;
		const currentPlayer = newGame
			.players
			.find(player => player.id === playerId)

		const { game: clickedGame, gameValidity } = isContextClick
			? rightClickMove(newGame, currentPlayer, rowIndex, colIndex)
			: leftClickMove(newGame, currentPlayer, rowIndex, colIndex);

		if (gameValidity.isValid) {
			clickedGame.save({}, (err, game: IGameDocument) => {
				const response = err ? err : game
				return res.send(response)
			})
		} else return res
			.status(401)
			.send(errorResponse(gameValidity.error))
	} catch (error) {
		res.status(400).send(errorResponse(GameScene.BAD_REQUEST))
	}
}

/**
 * Purge the player from the game and mark the other player as winner. 
 * @param req: Request received. Contains the GameID for which the info needs to be fetched 
 * @param res: Success / Error response based on the conditions and validations
 */
export const removePlayer = async (req: Request, res: Response) => {
	try {
		const newGame = await Game.findOne({ gameId: req.params.gameId }).exec()
		const game = validateGame(ApiParent.REMOVE, newGame, req.params.id);
		if (!game.isValid) {
			return res
				.status(401)
				.send(errorResponse(game.error))
		}

		const otherPlayer = newGame
			.players
			.find(player => player.localId !== req.params.id)

		if (otherPlayer) {
			otherPlayer.isWinner = true
			newGame.judge = GameScene.OPPONENT_LEFT
			newGame.state = GameState.OVER
			newGame.save({}, (err, game: IGameDocument) => {
				const response = err ? err : game
				res.send(response)
			})
		}
	} catch (error) {
		res.status(401).send(errorResponse())
	}
}

/**
 * Checks the current status of the game. 
 * If any of the player has won or the game has been a draw then accordingly that status 
 * would be shown, otherwise the running state of the game is responded
 * @param req: Request received. Contains the GameID for which the status has to be fetched
 * @param res: Success Response with the game id and status of the game. Error response if the 
 * Game for which the query is made is not found.
 */
export const checkStatus = (req: Request, res: Response) => {
	Game.findOne(
		{ gameId: req.params.gameId },
		(err: Error, game: IGameDocument) => {
			if (err) {
				res.status(401).send(errorResponse(GameScene.GAME_NOT_FOUND))
			} else {
				const newStatus = [
					GameScene['0_WON'],
					GameScene['1_WON'],
					GameScene.DRAW,
				].includes(game.judge)
					? game.judge
					: game.state
				const response = { gameId: game.gameId, newStatus }
				return res.send(response)
			}
		}
	)
}

/**
 * Retrieves full information of the game. All the details pertaining to the 
 * particular game will be returned. 
 * @param req: Request received. Contains the GameID for which the info needs to be fetched
 * @param res: Success Response with the game id and status of the game. Error response if the 
 * Game for which the query is made is not found.
 */
export const getInfo = (req: Request, res: Response) => {
	Game.findOne(
		{ gameId: req.params.gameId },
		(err: any, game: IGameDocument) => {
			if (game.state === GameState.OVER) {
				return res.status(401).send(errorResponse(GameScene.QUERYING_OLD_GAME))
			}

			const response = err ? err : game
			return res.send(response)
		}
	)
}