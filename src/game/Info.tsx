import React, { useEffect, useState, Fragment } from 'react'
import {
  Theme,
  makeStyles,
  createStyles,
} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import { GameState, InfoProps } from '../utils/contracts';
import Bomb from '../styles/images/bomb.png';
import Trophy from '../styles/images/trophy.png';
import Loser from '../styles/images/crying.png';
import AppTimer from './Timer';
import Confetti from 'react-dom-confetti';
import { StyledBadge, avataars } from '../utils/components';
import Constants from '../utils/constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  })
)

const Info: React.FC<InfoProps> = ({
  player,
  gameId,
  state,
  judge,
  winner,
  time,
  bombs
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (state === GameState.OVER && winner === player.id) {
      setTimeout(() => setShowConfetti(true), 2000);
    }
  }, [state, player, winner])

  const classes = useStyles()

  const renderPlayerWin = () => {
    if (state !== GameState.OVER) return null;
    let content = <div>It's a draw !!!</div>

    if (judge !== 'DRAW') {
      let imgSrc = Loser;
      let winText = 'You lost ... ';
      
      if (winner === player.id) {
        imgSrc = Trophy;
        winText = 'You won!!!'
      }

      content = <Fragment>
        <div className='explosionInfo' style={{ flexDirection: 'column' }}>
          <img src={imgSrc} alt="loser" height={45} width={50} />
          <div>{winText}</div>
        </div>
        <Confetti active={showConfetti} config={Constants.confettiConfig} />
      </Fragment>
    }

    return <div className="playerWinInfo" style={{ marginTop: 10 }}>
      {content}
    </div>
  }
  return (
    <div className='infoContainer'>
      <div className={classes.root}>
        <StyledBadge
          overlap="circle"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          variant="dot">
          {avataars[player.avatarId]}
        </StyledBadge>
        {!!player && (
          <div className="playerInfo">
            <div>Hola !</div>
            <div>{player.name}</div>
            {renderPlayerWin()}
          </div>
        )}
      </div>
      <div className="playerInfo">
        <div className="playerWinInfo">GAME INFO</div>
        <div style={{ marginBottom: 5 }}>Room: {gameId}</div>
        <div style={{ marginBottom: 5 }}>State: {state}</div>
        <Divider />
        <div className='infoContainer' style={{ marginTop: 5 }}>
          <div className='bombInfo'>
            <img src={Bomb} alt="bomb" height={35} width={35} />
            {bombs}
          </div>
          <AppTimer time={time} />
        </div>
      </div>
    </div>
  )
}

export default Info

