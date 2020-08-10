export interface IData {
	[key: string]: any
}

export interface IApiOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers?: IData
	body?: string
}

export interface IEndpointTypes {
	REQUEST: string
	SUCCESS: string
	ERROR: string
	BASE: string
}

export enum GameState {
	PREPARING = 'PREPARING',
	RUNNING = 'RUNNING',
	OVER = 'OVER',
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
}

export type Cell = {
	value: CellValue
	state: CellState
	exploded?: boolean
}

export interface IPoint {
	x: number
	y: number
}

export interface IMineField {
	maxRows: number
	maxCols: number
	noOfBombs: number
	field: Cell[][]
	bombLocations: IPoint[]
}

export interface IGame extends IData {
	gameId: string
	state: GameState
	turn: number
	judge: string
	players: IPlayer[]
	mineField: IMineField
	totalMarkedFlags: number
}

export interface ICellPosition {
	markedRow: number
	markedCol: number
	isValidBomb: boolean
}

export interface IPlayer extends IData {
	id: string
	name: string
	flagCount: number
	flagPositions: ICellPosition[]
	isWinner: boolean
}

export interface IError extends IData {
	error: string
	message: string
}

export interface IAppState {
	game: IGame
	me: IPlayer
	error?: IError
	removePlayer?: boolean
	removePlayerId?: number
}

export interface IAppProps {
	createGame: () => void
	joinGame: (gameId: string) => void
	handleStorageChange: (e: any) => void
	removePlayer: (gameId: string, playerId: string) => void
	makeMove: (
		gameId: string,
		playerId: string,
		rowIndex: number,
		colIndex: number,
		isContextClick: boolean
	) => void
	removeErrorFromStore: () => void
	game: IGame
	me: IPlayer
	shouldRemovePlayer?: boolean
	removePlayerId?: number
	error?: any
}

export enum Face {
	smile = '🤩',
	oh = '😮',
	lost = '😵',
	won = '😎',
}
