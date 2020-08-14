import * as React from 'react';

import getManager from '../managers';
import ConnectionManager from '../managers/connection';
import { IData, GameState, GameType, GameLevel } from '../utils/contracts';
import { Message, OutputMessageType } from '../utils/socketUtils';

class Home extends React.Component<any, IData> {
  private conn: ConnectionManager = getManager().getConnectionManager();
  private gameState: GameState;

  constructor(props: any) {
    super(props);
    const context = this;

    this.gameState = GameState.PREPARING;

    if (this.props.type === GameType.NEW) {
      this.conn.send(new Message(OutputMessageType.CREATE_GAME, {
        level: GameLevel.BEGINNER,
        name: 'Player1'
      }));
    } else if (this.props.type) {
      this.conn.send(new Message(OutputMessageType.JOIN_GAME, {
        name: 'Player2',
        gameId: 'some Game Id'
      }));
    }

    this.conn.subscribe((m: Message) => {
      console.log(m);
      // switch (m.getType()) {
      //   case OutputMessageType.NEW_GAME:
      //     context.gameState = MultiGameState.STATE_WAITING_OPPONENT;
      //     this.props.onWaitingOpponent(m);
      //     break;
      //   case OutputMessageType.GAME_ESTABLISHED:
      //     context.gameState = MultiGameState.STATE_MATCH_SUCCESS;
      //     this.props.onGameEstablished(m);
      //     break;
      //   case OutputMessageType.CHECK_BOARD:
      //     const payload: IOutputCheckBoard = m.getPayload() as IOutputCheckBoard;
      //     this.props.onBoardUpdate(payload);
      //     break;
      //   case OutputMessageType.ERROR:
      //     this.props.onGameError(m);
      //   default:
      //     break;
      // }

      context.forceUpdate();
    });
  }

  renderGame = () => {
    console.log('home props: ', this.props);
    const { game } = this.props;
    if (!game || (!!game && !!game.gameId && !this.props.type)) {
      console.log('redirecting to / to get the name and possibly game Id')
      this.props.history.push('/')
    } else return <div>Shreyas Bande {game.state}</div>
  }

  public render() {
    return (
      <div>
        {this.renderGame()}
      </div>
    );
  }

  // private renderWaitingConnection() {
  //   return (<div className="card placeholder-waiting-connection">
  //     <div className="card-body">
  //       <h5 className="card-title">Waiting for the connection...</h5>
  //       <h6 className="card-subtitle mb-2 text-muted">STATE_WAITING_CONNECTION</h6>
  //       <p className="card-text">Now this client is attempting to establish the connection with our game server. Please wait for the seconds.</p>
  //     </div>
  //   </div>);
  // }

  // private renderWaitingOpponent() {
  //   return (<div className="card placeholder-waiting-opponent">
  //     <div className="card-body">
  //       <h5 className="card-title">Connection established, Waiting for the opponent...</h5>
  //       <h6 className="card-subtitle mb-2 text-muted">STATE_WAITING_OPPONENT</h6>
  //       <p className="card-text">Now this client established the connection with our game server, and waiting for your friends.<br />As soon as your friend connects, game will start immediately.</p>
  //     </div>
  //   </div>);
  // }

  // private renderGameBoard() {
  //   return (<div className="game-board container">
  //     <div className="row">
  //       <BoardBoxMulti modelIndex={0} />
  //       <BoardBoxMulti modelIndex={1} />
  //       <BoardBoxMulti modelIndex={2} />
  //     </div>

  //     <div className="row">
  //       <BoardBoxMulti modelIndex={3} />
  //       <BoardBoxMulti modelIndex={4} />
  //       <BoardBoxMulti modelIndex={5} />
  //     </div>

  //     <div className="row">
  //       <BoardBoxMulti modelIndex={6} />
  //       <BoardBoxMulti modelIndex={7} />
  //       <BoardBoxMulti modelIndex={8} />
  //     </div>
  //   </div>);
  // }
}

export default Home;

