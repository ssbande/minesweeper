import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import DeleteIcon from '@material-ui/icons/Delete';

import SaveIcon from '@material-ui/icons/Save';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

const Landing = (props: any) => {
  const classes = useStyles();
  const nextPath = (path: string) => {
    props.history.push(path);
  }

  return <Fragment>
    <CssBaseline />
    <Container maxWidth="md">
      <div style={{
        padding: '20px',
        backgroundColor: '#cfe8fc',
        minHeight: '100vh',
      }}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Join
      </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SaveIcon />}
          onClick={() => nextPath('/home')}
        >
          Start game
      </Button>
      </div>
    </Container>
  </Fragment>
}

export default withRouter(Landing);