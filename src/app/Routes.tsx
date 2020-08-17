import React, { useEffect } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import posed, { PoseGroup } from 'react-pose';
import { IAppState, GameType, IPrevGameType } from "../utils/contracts";
import PrivateRoute from "./PrivateRoute";
import Landing from "../Landing/Landing";
import Navbar from "../Landing/Navbar";
import App from "./App";
import { usePrevious } from "../utils/components";


const RouteContainer = posed.div({
  enter: { opacity: 1, delay: 100, beforeChildren: true },
  exit: { opacity: 0 }
});

const Routes = (props: any) => {
  const { state: { gameType }, history } = props;
  const prevType = usePrevious<IPrevGameType>({ gameType });
  const { gameType: prevGameType } = prevType;

  useEffect(() => {
    if (gameType !== '' && gameType !== prevGameType) {
      history.push('/game');
    }
  }, [gameType, history, prevGameType])

  return (
    <div>
      <Navbar />
      <PoseGroup>
        <RouteContainer key={props.location.pathname}>
          <Switch>
            <Route exact path='/'>
              <Landing {...props} />
            </Route>
            <PrivateRoute path='/game' state={props.state}>
              <App />
            </PrivateRoute>
          </Switch>
        </RouteContainer>
      </PoseGroup>
    </div>
  )
};

const mapStateToProps = (state: IAppState) => ({
  state: state
});

export default withRouter(connect(mapStateToProps)(Routes));