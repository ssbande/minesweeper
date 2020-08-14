import React, { Fragment } from 'react';
import { IGame, IPlayer, GameState } from '../utils/contracts';
import '../styles/field.scss'
import FieldCell from './FieldCell';
import { CircularProgress } from '@material-ui/core';
import MyFlag from '../styles/images/greenFlag.png';
import OpponentFlag from '../styles/images/redFlag.png';
import Explosion from '../styles/images/explosion.png';
import Play from '../styles/images/play.png';
import HGlass from '../styles/images/hourglass.png';
import Handshake from '../styles/images/handshake.png';
import Exit from '../styles/images/exit-door.png';
import { pulse, headShake, slideInUp, fadeIn, zoomIn, slideInRight } from 'react-animations';
import Radium, { StyleRoot } from 'radium';

interface IFieldProps {
  game: IGame
  player: IPlayer
  winner: string
  handleCellClick(rowParam: number, colParam: number): (...args: any[]) => void
  handleCellContext(rowParam: number, colParam: number): (...args: any[]) => void
}

const styles = {
  pulse: {
    animation: 'x 1s ease 1s infinite',
    animationName: Radium.keyframes(pulse, 'pulse',)
  },
  headShake: {
    animation: 'x 3s ease 1s infinite',
    animationName: Radium.keyframes(headShake, 'headShake',)
  },
  slideInUp: {
    animation: 'x 3s ease 0s',
    animationName: Radium.keyframes(slideInUp, 'slideInUp',)
  },
  slideInRight: {
    animation: 'x 1.5s ease 0s',
    animationName: Radium.keyframes(slideInRight, 'slideInRight',)
  },
  fadeIn: {
    animation: 'x 3s ease 0s',
    animationName: Radium.keyframes(fadeIn, 'fadeIn',)
  },
  zoomIn: {
    animation: 'x 3s ease 0s',
    animationName: Radium.keyframes(zoomIn, 'zoomIn',)
  }
}

const Field = (props: IFieldProps) => {
  const field = props.game?.mineField?.field;
  if (!field) return null;

  const { mineField: { maxRows, maxCols, noOfBombs }, state, turn, totalMarkedFlags, judge } = props.game;
  return <div>
    {state === GameState.PREPARING && <div>
      <CircularProgress size={15} color="secondary" />
      <span style={{ paddingLeft: 8 }}>Waiting for some opponent to join ...</span>
    </div>}
    {state !== GameState.PREPARING && <div className='gameStatusRow'>
      <StyleRoot>{state === GameState.OVER
        ? <Fragment>
          {totalMarkedFlags === noOfBombs
            ? <div>
              {judge === 'DRAW'
                ? <div className='explosionInfo'>
                  <img style={styles.slideInUp} src={Handshake} alt="handshake" height={45} width={45} />
                  <div style={{ paddingLeft: 10 }}>
                    <div className='flagInfo'>Awesome</div>
                    <div>you both are ... </div>
                  </div>
                </div>
                : <div className='explosionInfo'>
                  <img style={styles.zoomIn} src={props.winner === props.player.id ? MyFlag : OpponentFlag} alt="handshake" height={45} width={45} />
                  <div style={{ paddingLeft: 10 }}>
                    <div className='flagInfo'>{props.game.players[+props.winner].flagPositions.filter(a => a.isValidBomb).length} of {props.game.players[+props.winner].flagCount}</div>
                    <div>vs {props.game.players[1 - +props.winner].flagPositions.filter(a => a.isValidBomb).length} of {props.game.players[1 - +props.winner].flagCount} <img src={props.winner === props.player.id ? OpponentFlag : MyFlag} alt="myFlag" height={10} width={10} /></div>
                  </div>
                </div>
              }
            </div>
            : <div className='explosionInfo'>
              {props.game.judge === 'OPPONENT_LEFT'
                ? <Fragment>
                  <img style={styles.slideInRight} src={Exit} alt="explosion" height={45} width={45} />
                  <div style={{ ...styles.fadeIn, paddingLeft: 10 }}>
                    <div className='flagInfo'>{props.winner === props.player.id ? 'Opponent' : 'You'}</div>
                    <div>left the game</div>
                  </div>
                </Fragment>
                : <Fragment>
                  <img style={styles.slideInUp} src={Explosion} alt="explosion" height={45} width={45} />
                  <div style={{ ...styles.fadeIn, paddingLeft: 10 }}>
                    <div className='flagInfo'>{props.winner === props.player.id ? 'Opponent' : 'You'}</div>
                    <div>dig a bomb</div>
                  </div>
                </Fragment>
              }
            </div>
          }
        </Fragment>
        : <Fragment>
          {(turn.toString() === props.player.id)
            ? <div className='explosionInfo'>
              <img style={styles.pulse} src={Play} alt="play" height={45} width={50} />
              <div style={{ paddingLeft: 10 }}>
                <div className='playerWinInfo'>PLAY</div>
                <div>it's your turn</div>
              </div>
            </div>
            : <div className='explosionInfo'>
              <img style={styles.headShake} src={HGlass} alt="wait" height={45} width={55} />
              <div style={{ paddingLeft: 10 }}>
                <div className='playerWinInfo'>WAIT</div>
                <div>for your turn</div>
              </div>
            </div>}
        </Fragment>
      }</StyleRoot>
      <div className='gameStatusRow'>
        <div>Your Flags
          <div className='flagInfo'>{props.game.players.find(p => p.id === props.player.id)?.flagCount}
            <img src={MyFlag} alt="myFlag" height={35} width={35} />
          </div>
        </div>
        <div style={{ padding: '0 15px' }}></div>
        <div>Opponnent's Flags
          <div className='flagInfo'>{props.game.players.find(p => p.id !== props.player.id)?.flagCount}
            <img src={OpponentFlag} alt="opponentsFlag" height={35} width={35} />
          </div>
        </div>
      </div>
    </div>}
    <div className='fieldContainer'>
      <div style={{
        width: `${30 * maxCols + 40}px`,
        height: `${30 * maxRows + 40}px`,
        border: '1px solid silver',
        padding: 20,
        background: 'white',
        borderRadius: '4px',
        boxShadow: '4px 4px 4px darkgrey',
        marginTop: '30px'
      }}>
        {(Array.from(Array(props.game.mineField.maxRows).keys()))
          .map((row: any, rIndex: number) => (
            <div key={`r_${rIndex}`} className='fieldContainer'>
              {Array.from(Array(props.game.mineField.maxCols).keys()).map((col, colIndex) => (
                <div key={`c_${colIndex}`}
                  style={{
                    width: 30,
                    height: 30,
                    border: '1px solid whitesmoke',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}><FieldCell
                    col={colIndex}
                    key={`${rIndex}-${colIndex}`}
                    onClick={props.handleCellClick}
                    onContext={props.handleCellContext}
                    field={props.game.mineField}
                    row={rIndex}
                    opponent={props.player.id === '0' ? props.game.players[1] : props.game.players[0]} /></div>
              ))}
            </div>
          ))}
      </div>
      {/* <div>
        {(Array.from(Array(props.game.mineField.maxRows).keys()))
          .map((row: any, rIndex: number) => (
            <div>
              {Array.from(Array(props.game.mineField.maxCols).keys()).map((col, colIndex) => (
                <div key={`c_${colIndex}`}>{colIndex}</div>
              ))}
            </div>
          ))}
      </div> */}
    </div>

    {/* <div className={classes.root}>
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid container item xs={8} spacing={0}>
          <FormRow />
        </Grid>
        <Grid container item xs={8} spacing={0}>
          <FormRow />
        </Grid>
        <Grid container item xs={8} spacing={0}>
          <FormRow />
        </Grid>
      </Grid>
    </div> */}
  </div>
}

export default Field;

