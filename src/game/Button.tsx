import React from 'react'
import { CellState, CellValue, IPlayer } from '../utils/contracts'
interface ButtonProps {
	col: number
	onClick(rowParam: number, colParam: number): (...args: any[]) => void
	onContext(rowParam: number, colParam: number): (...args: any[]) => void
	red?: boolean
	row: number
	state: CellState
	value: CellValue
	opponent: IPlayer
}

const Button: React.FC<ButtonProps> = ({
	col,
	onClick,
	onContext,
	red,
	row,
	state,
	value,
	opponent,
}) => {
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
			className={`Button ${
				state === CellState.DUG ? 'visible' : ''
			} value-${value} ${red ? 'red' : ''}`}
			onClick={onClick(row, col)}
			onContextMenu={onContext(row, col)}
		>
			{renderContent()}
		</div>
	)
}

export default Button
