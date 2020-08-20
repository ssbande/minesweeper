import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import { IAppState, IAppProps } from '../utils/contracts';
import Grid from '@material-ui/core/Grid';
import ActionButtons from './ActionButtons';
import Rules from './Rules';
import '../styles/App.scss';

const Landing = (props: IAppProps) => {
  console.log('landing props: ', props)
  return <Fragment>
    <CssBaseline />
    <Container maxWidth="md">
      <div style={{
        padding: '20px',
        backgroundColor: '#cfe8fc',
        minHeight: '100vh',
      }}>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <Rules />
            </Grid>
            <Grid item xs={3}>
              <ActionButtons {...props}/>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  </Fragment>
}

const mapState = (state: IAppState) => (state)
export default connect(mapState)(Landing);