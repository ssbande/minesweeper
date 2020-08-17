import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import RuleImg from '../styles/images/rules.png';
import SplitText from 'react-pose-text';
import posed from 'react-pose';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: 'white',
      backgroundColor: '#323232',
    },
  }),
);

const RuleDiv = posed.div({
  enter: {
    beforeChildren: true,
    staggerChildren: 50
  }
});

const charPoses = {
  exit: { opacity: 0 },
  enter: { opacity: 1 }
};

const Rules = () => {
  const classes = useStyles();
  return <Paper className={classes.paper} elevation={3}>
    <div className='ruleHead'>
      <img src={RuleImg} alt="rules" height={65} width={65} />
      <RuleDiv style={{ fontSize: '2rem' }} initialPose="exit" pose="enter">
        <SplitText charPoses={charPoses}>Game Rules ...</SplitText>
      </RuleDiv>
    </div>
    <RuleDiv initialPose="exit" pose="enter" style={{color: 'dodgerblue'}}>
      <ul>
        <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9672;</span> A game cannot be started until 2 players have joined the game.</li>
        <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9672;</span> A player cannot make a move until its their own chance. Players chance will come, once the other player has made his move.</li>
        <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9672;</span> A flag can be marked with Right Click on a cell. Although you cannot alter a flag which is marked by the other player. To distinguish properly, a player will see all their marked flags in GREEN and those of the other player's in RED</li>
        <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9672;</span> A Game can be marked over in below conditions:</li>
        <div>
          <ul>
            <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9678;</span> One of the player has exited the room, the other player would be a winner</li>
            <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9678;</span> One of the player clicked on the Bomb cell, the other player would be a winner</li>
            <li style={{listStyle: 'none'}}><span style={{color: 'white'}}>&#9678;</span> All of the flags are utilised ( both players combined ). In this case the player who has more correct bomb locations would be a winner</li>
          </ul>
        </div>
      </ul>
    </RuleDiv>
  </Paper>
}

export default Rules;