import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import posed from 'react-pose';
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import { PoseDiv } from '../utils/components'
import { IAppState, GameState, IGamePageProps } from '../utils/contracts';
import ErrorMessage from './ErrorMessage';
import Info from './Info';
import { OutputMessageType, Message } from '../utils/socketUtils';
import Field from './Field';

const AppContainer = posed.div({
  enter: { staggerChildren: 100 },
  exit: { staggerChildren: 20, staggerDirection: -1 }
});

const Game = (props: IGamePageProps) => {
  const [winner, setWinner] = useState<string>('')
  const [time, setTime] = useState<number>(0)
  const [live, setLive] = useState<boolean>(false)

  const { conn, error, removeErrorFromStore, game, me } = props;

  useEffect(() => {
    if (live) {
      const timer = setInterval(() => setTime(time + 100), 100)
      if (game?.state === GameState.OVER) clearInterval(timer)
      return () => clearInterval(timer)
    }
  }, [live, time, game])

  useEffect(() => {
    if (game.state === GameState.OVER) {
      if (game.players.filter(player => player.isWinner).length === 1) {
        setWinner(game.players.find(player => player.isWinner)?.id || '')
      }
    } else if (game.state === GameState.RUNNING) setLive(true)
  }, [game.state, game.players])

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    conn.send(new Message(OutputMessageType.MAKE_MOVE, {
      gameId: game.gameId,
      playerId: me.id,
      rowIndex: rowParam,
      colIndex: colParam,
      isContext: false
    }));
  }

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault()
    conn.send(new Message(OutputMessageType.MAKE_MOVE, {
      gameId: game.gameId,
      playerId: me.id,
      rowIndex: rowParam,
      colIndex: colParam,
      isContext: true
    }));
  }

  const containerWidth = game?.mineField?.maxCols > 15 ? 'lg' : 'md';
  return <AppContainer>
    <ErrorMessage error={error} removeErrorFromStore={removeErrorFromStore} />
    <CssBaseline />
    {!!props.game.gameId && (
      <Container maxWidth={containerWidth}>
        <div className='gameBoardContainer'>
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
}

const mapStateToProps = (state: IAppState) => {
  return {
    game: state.game,
    me: state.me,
    error: state.error
  }
}

export default connect(mapStateToProps)(Game)