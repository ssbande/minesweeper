import { IGameDocument } from "../game";
import { IValidateGame, GameScene, GameState, ApiParent } from "./contracts";
import constants from "./constants";

export const validateGame = (
  parent: ApiParent,
  game: IGameDocument,
  playerId?: string): IValidateGame => {
  switch (parent) {
    case ApiParent.JOIN:
      return validateJoining(game);
    case ApiParent.MOVE:
      return validateMove(game, playerId);
    case ApiParent.REMOVE:
      return validatePlayerRemoval(game, playerId);
    default:
      break;
  }
}

const validateJoining = (game: IGameDocument): IValidateGame => {
  let isValid = false;
  let error = '' as GameScene;

  if (!game) error = GameScene.GAME_NOT_FOUND
  else if (game.state === GameState.OVER) error = GameScene.QUERYING_OLD_GAME
  else if (game.players.length === constants.MaxPlayers) error = GameScene.PLAYER_EXCEEDING
  else isValid = true;

  return isValid
    ? { isValid }
    : { isValid, error }
}

const validateMove = (game: IGameDocument, playerId: string): IValidateGame => {
  let isValid = false;
  let error = '' as GameScene;

  if (!game) error = GameScene.GAME_NOT_FOUND
  else if (game.state === GameState.OVER) error = GameScene.QUERYING_OLD_GAME
  else if (game.state === GameState.PREPARING) error = GameScene.GAME_NOT_STARTED
  else if (+playerId < 0 || +playerId > constants.MaxPlayers - 1) error = GameScene.BAD_REQUEST
  else if (game.turn.toString() !== playerId) error = GameScene.NOT_YOUR_TURN
  else isValid = true;

  return isValid
    ? { isValid }
    : { isValid, error }
}

const validatePlayerRemoval = (game: IGameDocument, playerId: string): IValidateGame => {
  let isValid = false;
  let error = '' as GameScene;

  if (!game) error = GameScene.GAME_NOT_FOUND
  else if (game.state === GameState.OVER) error = GameScene.QUERYING_OLD_GAME
  else if (!game.players.find(player => player.localId === playerId)) error = GameScene.PLAYER_NOT_FOUND
  else isValid = true;

  return isValid
    ? { isValid }
    : { isValid, error }
}