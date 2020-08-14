import React from 'react';
import { IPlayer, IMineField, CellState, CellValue } from '../utils/contracts';
import MyFlag from '../styles/images/greenFlag.png';
import OpponentFlag from '../styles/images/redFlag.png';
import Bomb from '../styles/images/bomb.png';

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
  const { state, value, exploded, invalidFlag }= cell;

  const renderContent = (): React.ReactNode => {
		if (state === CellState.DUG) {
			if (value === CellValue.BOMB) {
				return <img src={Bomb} alt="bomb" height={15} width={15} />
			} else if (value === CellValue.NONE) {
				return null
			}

			return value
		} else if (state === CellState.FLAGGED) {
			const flagBelongsToOpponent = opponent.flagPositions.find(
				a => a.markedCol === col && a.markedRow === row
			)
			return flagBelongsToOpponent 
				? <img src={OpponentFlag} alt="myFlag" height={15} width={15} />
				: <img src={MyFlag} alt="myFlag" height={15} width={15} />
		}

		return null
  }
  
  return (
		<div
			className={`FieldCell ${
				state === CellState.DUG ? 'dug' : ''
			} value-${value} ${exploded ? 'red' : ''}
			${invalidFlag ? 'invalidFlag' : ''}`}
			onClick={onClick(row, col)}
			onContextMenu={onContext(row, col)}
		>
			{renderContent()}
		</div>
	)
}

export default FieldCell;
