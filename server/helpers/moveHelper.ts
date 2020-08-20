import { IGameDocument } from "../game";
import { CellState, GameScene, GameState, IPlayer, CellValue, IClickedGame } from "./contracts";
import mineChecker from "../controllers/mineChecker";
import MineField from '../controllers/mineField'
import { openResultGame } from "./builder";
const minefield = new MineField()

export const rightClickMove = (game: IGameDocument,
  player: IPlayer,
  rowIndex: number,
  colIndex: number): IClickedGame => {
  let isValid = true;
  let error = '' as GameScene;
  const cell = game.mineField.field[rowIndex][colIndex];

  if (cell.state === CellState.FLAGGED) {
    const playerHasFlagAtCurrentCell = !!player
      .flagPositions
      .filter(pos => pos.markedRow === rowIndex && pos.markedCol === colIndex)
      .length

    if (playerHasFlagAtCurrentCell) {
      cell.state = CellState.UNTOUCHED
      player.flagPositions = player
        .flagPositions
        .filter(pos => pos.markedRow !== rowIndex && pos.markedCol !== colIndex)
      player.flagCount--
      game.totalMarkedFlags--
    } else {
      isValid = false;
      error = GameScene.CANT_ALTER_OTHERS_FLAG
    }
  } else if (cell.state !== CellState.DUG) {
    cell.state = CellState.FLAGGED
    player.flagPositions.push({
      markedRow: rowIndex,
      markedCol: colIndex,
      isValidBomb: !!game
        .mineField
        .bombLocations
        .find(bomb => bomb.x === rowIndex && bomb.y === colIndex),
    })

    player.flagCount++
    game.totalMarkedFlags++
  }

  if (game.totalMarkedFlags === game.mineField.noOfBombs) {
    game.state = GameState.OVER
    game = mineChecker.checkGameResultByFlags(game)
  }

  return {
    game,
    gameValidity: {
      isValid,
      error
    }
  };
}

export const leftClickMove = (game: IGameDocument,
  player: IPlayer,
  rowIndex: number,
  colIndex: number): IClickedGame => {
  const cell = game.mineField.field[rowIndex][colIndex];
  switch (cell.state) {
    case CellState.FLAGGED:
      return flagCellClicked(game, player, rowIndex, colIndex)
    case CellState.DUG:
      return dugCellClicked(game)
    default:
      return untouchedCellClicked(game, player, rowIndex, colIndex);
  }
}

const dugCellClicked = (game: IGameDocument): IClickedGame => ({
  game,
  gameValidity: {
    isValid: false,
    error: GameScene.DIG_DUG_CELL
  }
})

const flagCellClicked = (game: IGameDocument, player: IPlayer, row: number, col: number): IClickedGame => {
  let error = '' as GameScene;

  const playerOwnsFlag = !!player
    .flagPositions
    .filter(pos => pos.markedRow === row && pos.markedCol === col)
    .length

  error = playerOwnsFlag
    ? GameScene.UNMARK_WITH_RIGHT_CLICK
    : GameScene.CANT_ALTER_OTHERS_FLAG

  return {
    game,
    gameValidity: {
      isValid: false,
      error
    }
  }

}

const untouchedCellClicked = (game: IGameDocument, player: IPlayer, row: number, col: number): IClickedGame => {
  const cell = game.mineField.field[row][col];
  switch (cell.value) {
    case CellValue.BOMB:
      return openBombCell(game, row, col, player);
    case CellValue.NONE:
      return openZeroCell(game, row, col);
    default:
      return openValueCell(game, row, col);
  }
}

const openValueCell = (game: IGameDocument, row: number, col: number): IClickedGame => {
  game.mineField.field[row][col].state = CellState.DUG;
  return {
    game,
    gameValidity: {
      isValid: true
    }
  }
}

const openZeroCell = (game: IGameDocument, row: number, col: number): IClickedGame => {
  game.mineField.field = minefield.expandZeroCells(game.mineField.field, row, col)
  return {
    game,
    gameValidity: {
      isValid: true
    }
  }
}

const openBombCell = (game: IGameDocument, row: number, col: number, player: IPlayer): IClickedGame => {
  const cell = game.mineField.field[row][col];
  cell.state = CellState.DUG
  cell.exploded = true
  game.players.find(p => p.id !== player.id).isWinner = true
  game.state = GameState.OVER
  game.judge = GameScene[`${1 - +player.id}_WON`]

  game = openResultGame(game)

  return {
    game,
    gameValidity: {
      isValid: true
    }
  }
}

