import { connect } from 'react-redux';
// import * as actions from '../state/actions';

import Home from './Home';
import { Dispatch, AnyAction } from 'redux';
import { IAppState, GameType } from '../utils/contracts';

export function mapStateToProps(state: IAppState) {
  return {...state, gameType: GameType.JOIN}
}

export function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    // Action that will be used in reducers
    onApp: () => console.log('shreyas bande')
    
    // onBoardUpdate: (payload: IOutputCheckBoard) => {
    //   dispatch(actions.boardUpdate(payload));
    // },
    // onGameError: (m: Message) => {
    //   dispatch(actions.onGameError(m))
    // },
    // onGameEstablished: (m: Message) => {
    //   dispatch(actions.onGameEstablished(m))
    // },
    // onWaitingOpponent: (m: Message) => {
    //   dispatch(actions.onWaitingOpponent(m))
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);