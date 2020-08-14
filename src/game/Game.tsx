import React, { useEffect, useState } from 'react'
import '../styles/App.scss'
import { connect } from 'react-redux'
import {
	createGame,
	joinGame,
	handleStorageChange,
	removePlayer,
	makeMove,
	removeErrorFromStore,
} from '../state/actions'
import {
	IAppState,
	IAppProps,
	IGame,
	GameState,
	Face,
	GameLevel,
} from '../utils/contracts'
import { Dispatch, bindActionCreators } from 'redux'
import ErrorMessage from './ErrorMessage'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Info from './Info'
import Field from './Field'
import posed from 'react-pose';
import { PoseDiv } from '../utils/components'
import { OutputMessageType, Message } from '../utils/socketUtils'
import getManager from '../managers';
import ConnectionManager from '../managers/connection';

const AppContainer = posed.div({
	enter: { staggerChildren: 100 },
	exit: { staggerChildren: 20, staggerDirection: -1 }
});

function App(props: IAppProps) {
	const conn: ConnectionManager = getManager().getConnectionManager();
	const {
		createGame,
		joinGame,
		handleStorageChange,
		removePlayer,
		makeMove,
		removeErrorFromStore,
		game,
		me,
		shouldRemovePlayer,
		removePlayerId,
		error,
	} = props
	const [winner, setWinner] = useState<string>('')
	// const [face, setFace] = useState<Face>(Face.smile)
	const [time, setTime] = useState<number>(0)
	const [live, setLive] = useState<boolean>(false)

	// const handleMouseDown = (): void => setFace(Face.oh)
	// const handleMouseUp = (): void => setFace(Face.smile)

	useEffect(() => {
		// window.addEventListener('mousedown', handleMouseDown)
		// window.addEventListener('mouseup', handleMouseUp)
		window.addEventListener('storage', handleStorageChange)
		window.addEventListener('beforeunload', e => {
			if (localStorage.getItem('game')) {
				localStorage.setItem('removePlayerId', me.id)
			}
		})

		conn.subscribe((m: Message) => {
			console.log('received message back: ', m.getType(), m.getPayload());
			// switch (m.getType()) {
			// 	case OutputMessageType.NEW_GAME:
			// 		context.gameState = MultiGameState.STATE_WAITING_OPPONENT;
			// 		this.props.onWaitingOpponent(m);
			// 		break;
			// 	case OutputMessageType.GAME_ESTABLISHED:
			// 		context.gameState = MultiGameState.STATE_MATCH_SUCCESS;
			// 		this.props.onGameEstablished(m);
			// 		break;
			// 	case OutputMessageType.CHECK_BOARD:
			// 		const payload: IOutputCheckBoard = m.getPayload() as IOutputCheckBoard;
			// 		this.props.onBoardUpdate(payload);
			// 		break;
			// 	case OutputMessageType.ERROR:
			// 		this.props.onGameError(m);
			// 	default:
			// 		break;
			// }
		});

		return () => {
			// window.removeEventListener('mousedown', handleMouseDown)
			// window.removeEventListener('mouseup', handleMouseUp)
		}
	})

	useEffect(() => {
		if (live) {
			const timer = setInterval(() => {
				setTime(time + 100)
			}, 100)

			if (game?.state === GameState.OVER) {
				clearInterval(timer)
			}
			return () => {
				clearInterval(timer)
			}
		}
	}, [live, time, game])

	useEffect(() => {
		const localGame = localStorage.getItem('game')
		if (!localGame) {
			createGame()
			conn.send(new Message(OutputMessageType.CREATE_GAME, {
				level: GameLevel.BEGINNER,
				name: 'Player1'
			}));
		} else if (!me.name) {
			const parsedGame = JSON.parse(localGame) as IGame
			joinGame(parsedGame.gameId)
			conn.send(new Message(OutputMessageType.JOIN_GAME, {
				name: 'Player2',
				gameId: 'some Game Id'
			}));
		}
	}, [createGame, joinGame, me, conn])

	useEffect(() => {
		if (game.state === GameState.OVER) {
			localStorage.removeItem('game')
			localStorage.removeItem('removePlayerId')
			if (
				game.players.filter(player => player.isWinner === true).length === 1
			) {
				setWinner(
					game.players.find(player => player.isWinner === true)?.id || ''
				)
			}
		} else if (game.state === GameState.RUNNING) {
			setLive(true)
		}
	}, [game.state, game.players])

	useEffect(() => {
		if (shouldRemovePlayer && !!removePlayerId) {
			removePlayer(game.gameId, removePlayerId.toString())
			conn.send(new Message(OutputMessageType.REMOVE_PLAYER, {
				name: 'Player2',
				gameId: game.gameId
			}));
		}
	}, [shouldRemovePlayer, removePlayerId, removePlayer, game.gameId, conn])

	const handleFaceClick = () => {
		// TODO: add restart functionality
	}

	const handleCellClick = (rowParam: number, colParam: number) => (): void => {
		makeMove(game.gameId, me.id, rowParam, colParam, false)
		conn.send(new Message(OutputMessageType.MAKE_MOVE, {
			gameId: game.gameId,
			playerId: me.id,
			rowParam,
			colParam,
			isContext: false
		}));
	}

	const handleCellContext = (rowParam: number, colParam: number) => (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	): void => {
		e.preventDefault()
		makeMove(game.gameId, me.id, rowParam, colParam, true)
		conn.send(new Message(OutputMessageType.MAKE_MOVE, {
			gameId: game.gameId,
			playerId: me.id,
			rowParam,
			colParam,
			isContext: true
		}));
	}

	return (
		<AppContainer>
			<ErrorMessage error={error} removeErrorFromStore={removeErrorFromStore} />
			<CssBaseline />
			{!!game.gameId && (
				<Container maxWidth="md">
					<div style={{
						padding: '20px',
						backgroundColor: '#cfe8fc',
						minHeight: '100vh',
					}}>
						<PoseDiv>
							<Info
								gameId={game.gameId}
								player={me}
								state={game.state}
								judge={game.judge}
								winner={winner}
								time={time}
								bombs={game.mineField.noOfBombs - game.totalMarkedFlags}
							/>
						</PoseDiv>
						<PoseDiv style={{ padding: '50px' }}>
							<Field
								game={game}
								player={me}
								winner={winner}
								handleCellClick={handleCellClick}
								handleCellContext={handleCellContext}
							/>
						</PoseDiv>
					</div>
				</Container>
			)}
		</AppContainer>
	)
}

const actionCreators = {
	createGame,
	joinGame,
	handleStorageChange,
	removePlayer,
	makeMove,
	removeErrorFromStore,
}
const mapStateToProps = (state: IAppState) => {
	return {
		game: state.game,
		me: state.me,
		shouldRemovePlayer: state.removePlayer,
		removePlayerId: state.removePlayerId,
		error: state.error,
	}
}
const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
