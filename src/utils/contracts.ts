import { Message } from "./socketUtils";
import { History } from 'history';
import ConnectionManager from "./connection";

export interface IData {
	[key: string]: any
}

export enum GameType {
	NEW = 'NEW',
	JOIN = 'JOIN'
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

export enum GameLevel {
	DEFAULT = 'DEFAULT',
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	EXPERT = 'EXPERT',
	CUSTOM = 'CUSTOM' //TODO: to be implemented
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
	invalidFlag?: boolean
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
	isLive: boolean
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
	localId: string
	name: string
	flagCount: number
	flagPositions: ICellPosition[]
	isWinner: boolean
	avatarId: number
	isActive: boolean
}

export interface IError extends IData {
	error: string
	message: string
}

export interface IAppState {
	game: IGame
	me: IPlayer
	error?: IError
	gameLevel: GameLevel
	gameType: GameType
	joiningGameId?: string
}

export interface InfoProps {
	gameId: string
	player: IPlayer
	state: GameState
	judge: string
	winner: string
	time: number
	bombs: number
}

export interface IPrevGameType {
  gameType: GameType
}

export interface IErrorProps {
	error?: {
		error: string
		message: string
	}
	removeErrorFromStore: () => void
}

export interface IFieldProps {
  game: IGame
  player: IPlayer
  winner: string
  handleCellClick(rowParam: number, colParam: number): (...args: any[]) => void
  handleCellContext(rowParam: number, colParam: number): (...args: any[]) => void
}

export interface IFieldCellProps {
  col: number
  onClick(rowParam: number, colParam: number): (...args: any[]) => void
  onContext(rowParam: number, colParam: number): (...args: any[]) => void
  row: number
  opponent: IPlayer
  field: IMineField
}

export interface IGamePageProps {
  conn: ConnectionManager
  game: IGame
  error?: IError,
  me: IPlayer,
  removeErrorFromStore: () => void;
}

export interface IGameProps {
	minesweeper: IAppState,
	onError: (m: Message) => void;
	onGameCreated: (m: Message) => void;
	onGameJoined: (m: Message) => void;
	onPlayer2Joined: (m : Message) => void;
	onMoveMade: (m: Message) => void;
	onPlayerRemoved: (m: Message) => void;
	removeErrorFromStore: () => void;
}

export interface IAppProps extends IData {
	game: IGame
	error?: IError
	gameLevel: GameLevel
	gameType: GameType
	me: IPlayer
	match: any
	location: any;
	history: History;
	staticContext?: any;
}

export interface ITimerProps {
  time: number
}

export interface ITimerState extends IData {
  seconds: string;
  minutes: string;
  hours: string;
}

export interface INavbarProps extends IData {
	state: IAppState;
	leaveGame: (localId: string) => void;
	history: any;
}