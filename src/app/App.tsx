import React, { useEffect, useState, Fragment } from 'react'
import './App.scss'
// import './main.scss'
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
} from '../utils/contracts'
import { Dispatch, bindActionCreators } from 'redux'
import ErrorMessage from '../game/ErrorMessage'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Info from '../game/Info'
import Field from '../game/Field'

function App(props: IAppProps) {
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
	const [face, setFace] = useState<Face>(Face.smile)
	const [time, setTime] = useState<number>(0)
	const [live, setLive] = useState<boolean>(false)

	const handleMouseDown = (): void => setFace(Face.oh)
	const handleMouseUp = (): void => setFace(Face.smile)

	useEffect(() => {
		window.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('mouseup', handleMouseUp)
		window.addEventListener('storage', handleStorageChange)
		window.addEventListener('beforeunload', e => {
			if (localStorage.getItem('game')) {
				localStorage.setItem('removePlayerId', me.id)
			}
		})

		return () => {
			window.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mouseup', handleMouseUp)
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
		} else if (!me.name) {
			const parsedGame = JSON.parse(localGame) as IGame
			joinGame(parsedGame.gameId)
		}
	}, [createGame, joinGame, me])

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
		}
	}, [shouldRemovePlayer, removePlayerId, removePlayer, game.gameId])

	const handleFaceClick = () => {
		// TODO: add restart functionality
	}

	const handleCellClick = (rowParam: number, colParam: number) => (): void => {
		makeMove(game.gameId, me.id, rowParam, colParam, false)
	}

	const handleCellContext = (rowParam: number, colParam: number) => (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	): void => {
		e.preventDefault()
		makeMove(game.gameId, me.id, rowParam, colParam, true)
	}

	return (
		<Fragment>
			<ErrorMessage error={error} removeErrorFromStore={removeErrorFromStore} />
			<CssBaseline />
			{!!game.gameId && (
				<Container maxWidth="md">
					<div style={{
						padding: '20px',
						backgroundColor: '#cfe8fc',
						minHeight: '100vh',
					}}>
						<Info
							gameId={game.gameId}
							player={me}
							state={game.state}
							judge={game.judge}
							winner={winner}
							time={time}
							bombs={game.mineField.noOfBombs - game.totalMarkedFlags}
						/>
						<div style={{ padding: '50px' }}>
							<Field
								game={game}
								player={me}
								winner={winner}
								handleCellClick={handleCellClick}
								handleCellContext={handleCellContext}
							/>
						</div>
					</div>
				</Container>
			)}
		</Fragment>
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
