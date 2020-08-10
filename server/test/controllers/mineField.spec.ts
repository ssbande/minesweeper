import MineField from '../../controllers/mineField'
import { GameLevel, CellValue, CellState } from '../../helpers/contracts'
const mineField = new MineField()

describe('MineField', () => {
	it('should be able to create a new board', () => {
		const newBoard = mineField.createNewBoard(GameLevel.DEFAULT)

		expect(newBoard).toHaveProperty('maxRows')
		expect(newBoard).toHaveProperty('maxCols')
		expect(newBoard).toHaveProperty('field')
		expect(newBoard).toHaveProperty('bombLocations')
		expect(newBoard.bombLocations.length).toBe(4)
		expect(newBoard.field.length).toBe(5)
		expect(newBoard.field[0].length).toBe(5)
		expect(newBoard.noOfBombs).toBe(4)
	})

	it('should be able to generate new field', () => {
		const response = mineField.generateField(GameLevel.DEFAULT)
		expect(response).toHaveProperty('config')
		expect(response).toHaveProperty('field')
		expect(response).toHaveProperty('bombLocations')
		expect(response.bombLocations.length).toBe(4)
		expect(response.field.length).toBe(5)
		expect(response.field[0].length).toBe(5)
		expect(response.config.maxRows).toBe(5)
	})

	it('should be able to expand zero undug cells', () => {
		const { field } = mineField.generateField(GameLevel.DEFAULT)
		let rowIndex = 0,
			colIndex = 0,
			found = false
		field.forEach((row, rIndex) => {
			row.forEach((col, cIndex) => {
				if (col.value === CellValue.NONE && !found) {
					rowIndex = rIndex
					colIndex = cIndex
					found = true
				}
			})
		})

		const newFields = mineField.expandZeroCells(field, rowIndex, colIndex)
		expect(newFields[rowIndex][colIndex + 1].state).toBe(CellState.DUG)
	})

	it('should be able to return cells for flagged/touched cells', () => {
		const { field } = mineField.generateField(GameLevel.DEFAULT)
		const cellColIndex = field[0].findIndex(
			cell => cell.value !== CellValue.BOMB
		)
		field[0][cellColIndex].state = CellState.DUG

		const newFields = mineField.expandZeroCells(field, 0, cellColIndex)

		expect(newFields).toEqual(field)
	})

	it('should be able to travers a cells neighbours', () => {
		const { field } = mineField.generateField(GameLevel.DEFAULT)
		const neighbours = mineField.traverseNeighbours(field, 0, 0)

		expect(neighbours.length).toBe(3)
		expect(neighbours[0].y).toBe(0)
		expect(neighbours[1].y).toBe(1)
		expect(neighbours[2].y).toBe(1)
		expect(neighbours[0].x).toBe(1)
		expect(neighbours[1].x).toBe(0)
		expect(neighbours[2].x).toBe(1)
	})
})
