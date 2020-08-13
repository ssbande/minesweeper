import React from 'react';
import { IPlayer, IMineField, CellState, CellValue } from '../utils/contracts';
import { red } from '@material-ui/core/colors';

interface IFieldCellProps {
  col: number
	onClick(rowParam: number, colParam: number): (...args: any[]) => void
	onContext(rowParam: number, colParam: number): (...args: any[]) => void
	row: number
  opponent: IPlayer
  field: IMineField
}

const FieldCell = (props: IFieldCellProps) => {
  const {field, row, col, opponent, onClick, onContext} = props;
  const cell = field.field[row][col];
  const { state, value, exploded }= cell;

  const renderContent = (): React.ReactNode => {
		if (state === CellState.DUG) {
			if (value === CellValue.BOMB) {
				return (
					<span role="img" aria-label="bomb">
						💣
					</span>
				)
			} else if (value === CellValue.NONE) {
				return null
			}

			return value
		} else if (state === CellState.FLAGGED) {
			const flagBelongsToOpponent = opponent.flagPositions.find(
				a => a.markedCol === col && a.markedRow === row
			)
			return flagBelongsToOpponent ? (
				<span role="img" aria-label="flag">
					🏴
				</span>
			) : (
				<span role="img" aria-label="flag">
					🚩
				</span>
			)
		}

		return null
  }
  
  return (
		<div
			className={`FieldCell ${
				state === CellState.DUG ? 'dug' : ''
			} value-${value} ${exploded ? 'red' : ''}`}
			onClick={onClick(row, col)}
			onContextMenu={onContext(row, col)}
		>
			{renderContent()}
		</div>
	)
}

export default FieldCell;
