import React, { Fragment } from 'react';
import { GameState, IFieldProps } from '../utils/contracts';
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
import { StyleRoot } from 'radium';
import { animeStyles, fieldContainerStyle } from '../utils/components';

const Field = (props: IFieldProps) => {
  const field = props.game?.mineField?.field;
  if (!field) return null;

  const {
    mineField: { maxRows, maxCols, noOfBombs },
    state,
    turn,
    totalMarkedFlags,
    judge
  } = props.game;

  const renderTurns = () => {
    let animation = animeStyles.headShake;
    let imgSrc = HGlass;
    let turnHeading = 'WAIT';
    let turnDesc = 'for your turn';

    if (turn.toString() === props.player.id) {
      animation = animeStyles.pulse;
      imgSrc = Play;
      turnHeading = 'PLAY';
      turnDesc = "it's your turn";
    }

    return <div className='explosionInfo'>
      <img style={animation} src={imgSrc} alt="wait" height={45} width={55} />
      <div style={{ paddingLeft: 10 }}>
        <div className='playerWinInfo'>{turnHeading}</div>
        <div>{turnDesc}</div>
      </div>
    </div>
  }

  const renderDigWinner = () => {
    let animation = animeStyles.slideInUp;
    let imgSrc = Explosion;
    let desc = 'dig a bomb';

    if (props.game.judge === 'OPPONENT_LEFT') {
      animation = animeStyles.slideInRight;
      imgSrc = Exit;
      desc = 'left the game'
    }

    return <div className='explosionInfo'>
      <img style={animation} src={imgSrc} alt="explosion" height={45} width={45} />
      <div style={{ ...animeStyles.fadeIn, paddingLeft: 10 }}>
        <div className='flagInfo'>{props.winner === props.player.id ? 'Opponent' : 'You'}</div>
        <div>{desc}</div>
      </div>
    </div>
  }

  const renderDrawOrFlagWinner = () => {
    let animation = animeStyles.zoomIn;
    let imgSrc = props.winner === props.player.id ? MyFlag : OpponentFlag;
    let winHead = `${props.game.players[+props.winner]
      .flagPositions
      .filter(a => a.isValidBomb).length} of ${props.game.players[+props.winner].flagCount}`;
    let winDesc: any = <Fragment>
      {`vs ${props.game.players[1 - +props.winner]
        .flagPositions
        .filter(a => a.isValidBomb).length} of ${props.game.players[1 - +props.winner].flagCount} `}
      <img src={props.winner === props.player.id ? OpponentFlag : MyFlag} alt="myFlag" height={10} width={10} />
    </Fragment>

    if (judge === 'DRAW') {
      animation = animeStyles.slideInUp;
      imgSrc = Handshake;
      winHead = 'Awesome';
      winDesc = 'you both are ... ';
    }

    return <div className='explosionInfo'>
      <img style={animation} src={imgSrc} alt="handshake" height={45} width={45} />
      <div style={{ paddingLeft: 10 }}>
        <div className='flagInfo'>{winHead}</div>
        <div>{winDesc}</div>
      </div>
    </div>
  }

  const renderWaitingOpponent = () => {
    return state === GameState.PREPARING && <div>
      <CircularProgress size={15} color="secondary" />
      <span style={{ paddingLeft: 8 }}>Waiting for some opponent to join ...</span>
    </div>
  }

  const renderGameState = () => {
    if (state !== GameState.OVER) return renderTurns()
    else {
      if (totalMarkedFlags === noOfBombs) return renderDrawOrFlagWinner()
      else return renderDigWinner()
    }
  }

  const renderFlagStatus = () => {
    return <div className='gameStatusRow'>
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
  }

  return <div>
    {renderWaitingOpponent()}
    {state !== GameState.PREPARING && <div className='gameStatusRow'>
      <StyleRoot>{renderGameState()}</StyleRoot>
      {renderFlagStatus()}
    </div>}
    <div className='fieldContainer'>
      <div style={fieldContainerStyle(maxRows, maxCols)}>
        {(Array.from(Array(props.game.mineField.maxRows).keys()))
          .map((row: any, rIndex: number) => (
            <div key={`r_${rIndex}`} className='fieldContainer'>
              {Array.from(Array(props.game.mineField.maxCols).keys()).map((col, colIndex) => (
                <div key={`c_${colIndex}`} className='fieldStyle' ><FieldCell
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
    </div>
  </div>
}

export default Field;

