import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { IAppState, GameState, INavbarProps } from '../utils/contracts';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Rules from './Rules';
import { OutputMessageType, Message } from '../utils/socketUtils';
import getManager from '../utils/socketManager';
import { leaveGame } from '../state/actions';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = (props: INavbarProps) => {
  console.log('navbarProps: ', props)
  const { state } = props;
  const classes = useStyles();
  const [showRules, setShowRules] = useState<boolean>(false)
  const [open, setOpen] = React.useState(false);
  const conn = getManager().getConnectionManager();

  const handleClose = () => {
    setOpen(false);
  };

  const handleExit = () => {
    conn.send(new Message(OutputMessageType.REMOVE_PLAYER, {
      gameId: state.game.gameId,
      playerId: state.me.localId
    }));
    setOpen(false);
    props.leaveGame(state.me.localId)
    props.history.push("/")
  }

  return <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Minesweeper - SB
        </Typography>
        {state.game?.state === GameState.RUNNING && <div>
          <Button color="inherit" onClick={() => setShowRules(true)}>Rules</Button>
          <Button color="inherit" onClick={() => setOpen(true)}>Exit Game</Button>
          <Drawer anchor='top' open={showRules} onClose={() => setShowRules(false)}>
            <Rules />
          </Drawer>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Are you sure ?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to exit the game ? <br />
                You would lose this game, if you exit.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button onClick={handleExit} color="secondary">OK</Button>
            </DialogActions>
          </Dialog>
        </div>}
      </Toolbar>
    </AppBar>
  </div>
}

const actionCreators = {
  leaveGame
}
const mapStateToProps = (state: IAppState) => ({ state });
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);