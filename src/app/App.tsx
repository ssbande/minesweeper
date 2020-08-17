import React from 'react';
import { connect } from 'react-redux';
import {
  onGameCreated,
  onGameJoined,
  onMoveMade,
  onPlayerRemoved,
  onError,
  removeErrorFromStore,
  onPlayer2Joined
} from '../state/actions';
import { IAppState, IData, GameType, IGameProps } from '../utils/contracts';
import { Dispatch, bindActionCreators } from 'redux';
import Game from '../game/Game'
import { Message, OutputMessageType, InputMessageType } from '../utils/socketUtils';
import ConnectionManager from '../utils/connection';
import getManager from '../utils/socketManager';

class App extends React.Component<IGameProps, IData> {
  private conn: ConnectionManager = getManager().getConnectionManager();
  constructor(props: IGameProps) {
    super(props);
    const context = this;
    const {
      minesweeper: {
        me: { name },
        gameType,
        gameLevel,
        joiningGameId
      }
    } = this.props;

    if (gameType === GameType.NEW) {
      this.conn.send(new Message(OutputMessageType.CREATE_GAME, {
        name,
        gameLevel
      }));
    } else if (gameType === GameType.JOIN) {
      this.conn.send(new Message(OutputMessageType.JOIN_GAME, {
        name,
        joiningGameId: joiningGameId || ''
      }));
    }

    this.conn.subscribe((m: Message) => {
      console.log(m);
      switch (m.getType()) {
        case InputMessageType.GAME_CREATED:
          this.props.onGameCreated(m);
          break;
        case InputMessageType.GAME_JOINED:
          this.props.onGameJoined(m);
          break;
        case InputMessageType.PLAYER2_JOINED:
          this.props.onPlayer2Joined(m);
          break;
        case InputMessageType.MADE_MOVE:
          this.props.onMoveMade(m);
          break;
        case InputMessageType.REMOVED_PLAYER:
          this.props.onPlayerRemoved(m);
          break;
        case InputMessageType.ERROR:
          this.props.onError(m);
          break;
        default:
          break;
      }
      context.forceUpdate();
    });
  }

  public render() {
    return <Game conn={this.conn} removeErrorFromStore={this.props.removeErrorFromStore} />;
  }
}

const actionCreators = {
  onGameCreated,
  onGameJoined,
  onMoveMade,
  onPlayerRemoved,
  onError,
  removeErrorFromStore,
  onPlayer2Joined
}
const mapStateToProps = (state: IAppState) => ({ minesweeper: state });
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(App);