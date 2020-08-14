import mongoose from 'mongoose'

export enum GameState {
	PREPARING = 'PREPARING',
	RUNNING = 'RUNNING',
	OVER = 'OVER',
}

export enum GameScene {
	BAD_REQUEST = 'BAD_REQUEST',
	DIG_DUG_CELL = 'DIG_DUG_CELL',
	GAME_NOT_STARTED = 'GAME_NOT_STARTED',
	QUERYING_OLD_GAME = 'QUERYING_OLD_GAME',
	PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
	GAME_NOT_FOUND = 'GAME_NOT_FOUND',
	KEEP_RUNNING = 'KEEP_RUNNING',
	PLAYER_EXCEEDING = 'PLAYER_EXCEEDING',
	NOT_YOUR_TURN = 'NOT_YOUR_TURN',
	CANT_ALTER_OTHERS_FLAG = 'CANT_ALTER_OTHERS_FLAG',
	UNMARK_WITH_RIGHT_CLICK = 'UNMARK_WITH_RIGHT_CLICK',
	ALREADY_MARKED = 'ALREADY_MARKED',
	MARK_AFTER_GAME_OVER = 'MARK_AFTER_GAME_OVER',
	DRAW = 'DRAW',
	'0_WON' = 'PLAYER1 WON',
	'1_WON' = 'PLAYER2 WON',
}

export interface ICellPosition {
	markedRow: number
	markedCol: number
	isValidBomb: boolean
}

export interface IPlayer {
	id: string
	name: string
	flagCount: number
	flagPositions: ICellPosition[]
	isWinner: boolean
}

export enum CellValue {
	NONE,
	ONE,
	TWO,
	THREE,
	FOUR,
	FIVE,
	SIX,
	SEVEN,
	EIGHT,
	BOMB,
}

export enum CellState {
	UNTOUCHED = 'UNTOUCHED',
	DUG = 'DUG',
	FLAGGED = 'FLAGGED',
	INALID_FLAG = 'INALID_FLAG',
}

export type Cell = {
	value: CellValue
	state: CellState
	exploded?: boolean
	invalidFlag?: boolean
}

export interface IPoint {
	x: number
	y: number
}

export interface IField {
	config: {
		maxRows: number
		maxCols: number
		noOfBombs: number
	}
	field: Cell[][]
	bombLocations: IPoint[]
}

export interface IMineField {
	maxRows: number
	maxCols: number
	noOfBombs: number
	field: Cell[][]
	bombLocations: IPoint[]
}

export interface IGame {
	gameId: string
	state: GameState
	turn: number
	judge: GameScene
	players: IPlayer[]
	mineField: IMineField
	totalMarkedFlags: number
}

export const cellSchema = new mongoose.Schema({
	value: { type: Number, required: true },
	state: { type: String, required: true },
	exploded: { type: Boolean, required: false },
	invalidFlag: { type: Boolean, required: false },
})

export const mineFieldSchema = new mongoose.Schema({
	maxRows: { type: Number, required: true },
	maxCols: { type: Number, required: true },
	noOfBombs: { type: Number, required: true },
	field: [[cellSchema]],
	bombLocations: [
		{
			x: Number,
			y: Number,
		},
	],
})

export const GameSchema = new mongoose.Schema({
	gameId: { type: String, required: true },
	state: { type: String, required: true },
	turn: { type: Number, required: true },
	totalMarkedFlags: { type: Number, required: true },
	judge: { type: String, required: true },
	players: [
		{
			id: String,
			name: String,
			flagCount: Number,
			isWinner: Boolean,
			flagPositions: [
				{
					markedRow: Number,
					markedCol: Number,
					isValidBomb: Boolean,
				},
			],
		},
	],
	mineField: mineFieldSchema,
})

export enum GameLevel {
	DEFAULT = 'DEFAULT',
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	EXPERT = 'EXPERT',
}

export interface INeighbours {
	cell: Cell
	x: number
	y: number
}
