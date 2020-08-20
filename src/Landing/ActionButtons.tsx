import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IAppProps, IAppState, GameLevel } from '../utils/contracts';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import { lightSpeedIn } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import {
  createGame,
  joinGame
} from '../state/actions';
import { Dispatch, bindActionCreators } from 'redux';

const styles = {
  lightSpeedIn: {
    animation: 'x 1s ease 0s',
    animationName: Radium.keyframes(lightSpeedIn, 'lightSpeedIn',)
  },
}

const ActionButtons = (props: IAppProps) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameIdError, setGameIdError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [levelError, setLevelError] = useState(false);
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowCreate(true), 500);
    setTimeout(() => setShowJoin(true), 1000);
  }, [])

  const handleCreateClick = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);
  const handleCreate = () => {
    if (!name) setNameError(true)
    else if (!level) setLevelError(true)
    else {
      props.createGame(level, name)
        .then(props.history.push('/game'))
        .catch((err: Error) => console.log(err))
    }
  }
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameError(false)
    setName(e.target.value)
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setLevelError(false)
    setLevel(e.target.value)
  }


  const handleJoinClick = () => setJoinOpen(true);
  const handleJoinClose = () => setJoinOpen(false);
  const handleJoin = () => {
    if (!name) setNameError(true)
    else if (!gameId) setGameIdError(true)
    else {
      props.joinGame(gameId, name)
        .then(props.history.push('/game'))
        .catch((err: Error) => console.log(err))
    }
  }

  return <Fragment>
    <StyleRoot>
      {showCreate && <div style={styles.lightSpeedIn}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<PlayArrowIcon />}
          onClick={handleCreateClick}
        >Start game</Button>
      </div>}
    </StyleRoot>
    <Dialog open={createOpen} onClose={handleCreateClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="create-game">Start the game</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To start a game, please provide your name and select the level you want to play at
        </DialogContentText>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField error={nameError} required id="name" label="Name" placeholder='Name' onChange={handleNameChange} />
          <FormControl component="fieldset" error={levelError}>
            <FormLabel component="legend">Game Level</FormLabel>
            <RadioGroup row aria-label="quiz" name="quiz" value={level} onChange={handleLevelChange}>
              <FormControlLabel value={GameLevel.BEGINNER} control={<Radio color="secondary" />} label="Beginner" />
              <FormControlLabel value={GameLevel.INTERMEDIATE} control={<Radio color="secondary" />} label="Intermediate" />
              <FormControlLabel value={GameLevel.EXPERT} control={<Radio color="secondary" />} label="Expert" />
            </RadioGroup>
            <FormHelperText></FormHelperText>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreateClose} color="primary">Cancel</Button>
        <Button onClick={handleCreate} color="primary">Launch</Button>
      </DialogActions>
    </Dialog>

    <div style={{ height: 10 }}></div>
    <StyleRoot>
      {showJoin && <div style={styles.lightSpeedIn}>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<MergeTypeIcon />}
          onClick={handleJoinClick}>Join game
    </Button>
      </div>}
    </StyleRoot>
    <Dialog open={joinOpen} onClose={handleJoinClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="join-game">Join the game</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join a game, please provide a game identifier
        </DialogContentText>
        <TextField error={nameError} required id="name" label="Name" placeholder='Name' onChange={handleNameChange} />
        <div style={{ height: 10 }} />
        <TextField error={gameIdError} fullWidth required id="gameId" label="Game Identifier" placeholder='Game ID' onChange={(e) => setGameId(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleJoinClose} color="secondary">Cancel</Button>
        <Button onClick={handleJoin} color="secondary">Join</Button>
      </DialogActions>
    </Dialog>

  </Fragment>
}

const actionCreators = {
  createGame,
  joinGame
}
const mapState = (state: IAppState) => (state)
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch)
export default connect(mapState, mapDispatchToProps)(ActionButtons);