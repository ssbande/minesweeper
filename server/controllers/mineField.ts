import {
	IMineField,
	CellState,
	GameLevel,
	IField,
	Cell,
	CellValue,
	INeighbours,
	IPoint,
} from '../helpers/contracts'
import Constants from '../helpers/constants'

class MineField {

	/**
	 * The main orchestrator method to create the new board -  mineField
	 * @param level Difficulty level of the game
	 * @returns The game configuration and bomb locations along with the 
	 * complete mine field in which the bombs and the cell values are 
	 * already placed
	 */
	public createNewBoard(level?: string): IMineField {
		const configLevel: GameLevel =
			GameLevel[!!level ? level.toUpperCase() : 'BEGINNER']
		const { config, field, bombLocations } = this.generateField(configLevel)
		return {
			...config,
			field,
			bombLocations,
		}
	}

	/**
	 * Main spine method to create the minefield, place the bombs as per the config
	 * and then generate the cell values depending on where the bombs are placed 
	 * @param level Difficulty level of the game 
	 */
	public generateField(level: GameLevel): IField {
		const config = Constants.GameLevelConfig[level]
		let cells: Cell[][] = []
		const bombLocations: IPoint[] = []
		const { maxCols, maxRows, noOfBombs } = config

		// create cells with initial value 
		cells = Array(maxRows).fill(null).map(() => {
			const cols = Array(maxCols).fill(null).map(() => ({
				value: CellValue.NONE,
				state: CellState.UNTOUCHED,
			}))
			return [...cols]
		})

		// Place the bombs randomly in the initialised cells 
		let bombsPlaced = 0
		while (bombsPlaced < noOfBombs) {
			const randomRow = Math.floor(Math.random() * maxRows)
			const randomCol = Math.floor(Math.random() * maxCols)
			const currentCell = cells[randomRow][randomCol]
			if (currentCell.value !== CellValue.BOMB) {
				bombLocations.push({ x: randomRow, y: randomCol })
				cells[randomRow][randomCol].value = CellValue.BOMB
				bombsPlaced++
			}
		}

		// Calculate the cell values depending on how many bombs are surrounding it.
		Array(maxRows).fill(null).forEach((r, rowIndex: number) => {
			Array(maxCols).fill(null).forEach((c, colIndex: number) => {
				const neighbours = this.traverseNeighbours(cells, rowIndex, colIndex)
				if (cells[rowIndex][colIndex].value !== CellValue.BOMB) {
					cells[rowIndex][colIndex].value = neighbours
						.filter(neighbour => neighbour.cell.value === CellValue.BOMB)
						.length
				}
			})
		})

		return {
			config,
			field: cells,
			bombLocations,
		}
	}

	/**
	 * This will be called when a zero-cell is clicked. This will open up the minefield 
	 * to the point where every cell in each direction in a non-zero cell
	 * @param field: minefield to open the cells in 
	 * @param rowIndex: row index of the clicked cell
	 * @param colIndex: col index of the clicked cell 
	 */
	public expandZeroCells(
		field: Cell[][],
		rowIndex: number,
		colIndex: number
	): Cell[][] {
		const currentCell = field[rowIndex][colIndex]

		if (currentCell.state === CellState.FLAGGED
			|| currentCell.state === CellState.DUG) {
			return field
		}

		let newField = field.slice()
		newField[rowIndex][colIndex].state = CellState.DUG

		const neighbours = this.traverseNeighbours(field, rowIndex, colIndex)
		for (let index = 0; index < neighbours.length; index++) {
			const { cell, x, y } = neighbours[index]
			if (cell.value !== CellValue.BOMB && cell.state === CellState.UNTOUCHED) {
				if (cell.value === CellValue.NONE)
					newField = this.expandZeroCells(newField, x, y)
				else newField[x][y].state = CellState.DUG
			}
		}

		return newField
	}

	/**
	 * Traverse each surrounding cell, validate whether the surrounding cell is 
	 * inbound to the field dimensions or not and gather its value.
	 * @param cells: minefield to read the surrounding cells from  
	 * @param rowIndex: row index of the current cell 
	 * @param colIndex: col index of the current cell 
	 * @returns an array of cells (with all their data) which are surrounding the 
	 * current cell and in bound to the mine field
	 */
	public traverseNeighbours(
		cells: Cell[][],
		rowIndex: number,
		colIndex: number
	): INeighbours[] {
		const checkInBounds = ({ x, y }) => x >= 0
			&& x < cells.length
			&& y >= 0
			&& y < cells[0].length

		const neighbours = Constants.dx
			.map((x, i) => ({ dx: x, dy: Constants.dy[i] }))
			.map(delta => ({ x: rowIndex + delta.dx, y: colIndex + delta.dy }))
			.filter(checkInBounds)
			.map(({ x, y }) => ({ cell: cells[x][y], x, y }))

		return neighbours
	}
}

export default MineField
