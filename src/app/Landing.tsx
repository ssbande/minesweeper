import React, { Fragment } from 'react';
import Button from '../game/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const Landing = () => {
  return <Fragment>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          Minesweeper - SB
					</Typography>
      </Toolbar>
    </AppBar>
  </Fragment>
}

export default Landing;