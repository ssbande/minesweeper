import { Request, Response } from 'express'
import Game, { IGameDocument } from '../game'
import {
	IGame,
	GameState,
	GameScene,
	CellState,
	CellValue,
} from '../helpers/contracts'
import { errorResponse, createPlayer } from '../helpers/builder'
import constants from '../helpers/constants'
import MineField from './mineField'
import { v4 } from 'uuid'
import mineChecker from './mineChecker'
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
	const newGame: IGame = {
		gameId: v4(),
		state: GameState.PREPARING,
		turn: 0,
		totalMarkedFlags: 0,
		judge: GameScene.KEEP_RUNNING,
		players: [createPlayer(0)],
		mineField: mineSweeperBoard,
	}

	console.log(
		'mineSweeperBoard: ',
		mineSweeperBoard.field.map(a => a.map(b => b.value))
	)
	console.log('bomb Locations: ', mineSweeperBoard.bombLocations)
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
	if (!newGame) {
		res.status(401).send(errorResponse(GameScene.GAME_NOT_FOUND))
	} else if (newGame.state === GameState.OVER) {
		res.status(401).send(errorResponse(GameScene.QUERYING_OLD_GAME))
	} else if (newGame.players.length === constants.MaxPlayers) {
		res.status(401).send(errorResponse(GameScene.PLAYER_EXCEEDING))
	} else {
		newGame.players.push(createPlayer(newGame.players.length))
		newGame.state = GameState.RUNNING
		newGame.save({}, (err, game: IGameDocument) => {
			if (err) {
				res.status(401).send(errorResponse())
			} else res.send(game)
		})
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
	if (!newGame) {
		res.status(401).send(errorResponse(GameScene.GAME_NOT_FOUND))
	} else if (newGame.state === GameState.OVER) {
		res.status(401).send(errorResponse(GameScene.QUERYING_OLD_GAME))
	} else if (newGame.state === GameState.PREPARING) {
		res.status(401).send(errorResponse(GameScene.GAME_NOT_STARTED))
	} else {
		try {
			const { playerId, rowIndex, colIndex, isContextClick } = req.body
			if (+playerId < 0 || +playerId > 1) {
				// eslint-disable-next-line no-throw-literal
				throw {}
			}

			if (newGame.turn.toString() !== playerId) {
				return res.status(401).send(errorResponse(GameScene.NOT_YOUR_TURN))
			}

			const currentPlayer = newGame.players.find(
				player => player.id === playerId
			)
			const currentCell = newGame.mineField.field[rowIndex][colIndex]
			newGame.turn = playerId === '0' ? 1 : 0

			if (isContextClick) {
				if (currentCell.state === CellState.FLAGGED) {
					if (
						!!currentPlayer.flagPositions.filter(
							pos => pos.markedRow === rowIndex && pos.markedCol === colIndex
						).length
					) {
						currentCell.state = CellState.UNTOUCHED
						currentPlayer.flagPositions = currentPlayer.flagPositions.filter(
							pos => pos.markedRow !== rowIndex && pos.markedCol !== colIndex
						)
						currentPlayer.flagCount--
						newGame.totalMarkedFlags--
					} else {
						return res
							.status(401)
							.send(errorResponse(GameScene.CANT_ALTER_OTHERS_FLAG))
					}
				} else if (currentCell.state !== CellState.DUG) {
					currentCell.state = CellState.FLAGGED
					currentPlayer.flagPositions.push({
						markedRow: rowIndex,
						markedCol: colIndex,
						isValidBomb: !!newGame.mineField.bombLocations.find(
							bomb => bomb.x === rowIndex && bomb.y === colIndex
						),
					})

					currentPlayer.flagCount++
					newGame.totalMarkedFlags++
				}

				if (newGame.totalMarkedFlags === newGame.mineField.noOfBombs) {
					newGame.state = GameState.OVER
					newGame = mineChecker.checkGameResultByFlags(newGame)
				}
				newGame.save({}, (err, game: IGameDocument) => {
					const response = err ? err : game
					res.send(response)
				})
				return
			}

			if (currentCell.state === CellState.FLAGGED) {
				if (
					!!currentPlayer.flagPositions.filter(
						pos => pos.markedRow === rowIndex && pos.markedCol === colIndex
					).length
				) {
					return res
						.status(401)
						.send(errorResponse(GameScene.UNMARK_WITH_RIGHT_CLICK))
				} else {
					return res
						.status(401)
						.send(errorResponse(GameScene.CANT_ALTER_OTHERS_FLAG))
				}
			} else {

				// If the player clicked on a bomb
				if (currentCell.value === CellValue.BOMB) {
					currentCell.state = CellState.DUG
					currentCell.exploded = true
					newGame.players.find(
						player => player.id !== currentPlayer.id
					).isWinner = true
					newGame.state = GameState.OVER
					newGame.judge =
						playerId === '0' ? GameScene['1_WON'] : GameScene['0_WON']
					for (let r = 0; r < newGame.mineField.field.length; r++) {
						const row = newGame.mineField.field[r]
						for (let c = 0; c < row.length; c++) {
							if (newGame.mineField.field[r][c].value === CellValue.BOMB) {
								newGame.mineField.field[r][c].state = CellState.DUG
							}
						}
					}
				} else if (currentCell.value === CellValue.NONE) {
					newGame.mineField.field = minefield.expandZeroCells(
						newGame.mineField.field,
						rowIndex,
						colIndex
					)
				} else {
					currentCell.state = CellState.DUG
				}

			}

			newGame.save({}, (err, game: IGameDocument) => {
				const response = err ? err : game
				return res.send(response)
			})
		} catch (error) {
			res.status(400).send(errorResponse(GameScene.BAD_REQUEST))
		}
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
		if (!newGame) {
			res.status(401).send(errorResponse(GameScene.GAME_NOT_FOUND))
		} else if (!newGame.players.find(player => player.id === req.params.id)) {
			res.status(401).send(errorResponse(GameScene.PLAYER_NOT_FOUND))
		} else if (newGame.state === GameState.OVER) {
			res.status(401).send(errorResponse(GameScene.QUERYING_OLD_GAME))
		} else {
			if (
				newGame.players.find(player => player.id !== req.params.id.toString())
			) {
				newGame.players.find(
					player => player.id !== req.params.id.toString()
				).isWinner = true
				newGame.judge =
					req.params.id === '0' ? GameScene['1_WON'] : GameScene['0_WON']
				newGame.state = GameState.OVER
				newGame.save({}, (err, game: IGameDocument) => {
					const response = err ? err : game
					res.send(response)
				})
			}
		}
	} catch (error) {
		res.status(401).send(errorResponse())
	}
}
