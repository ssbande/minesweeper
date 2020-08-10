import { errorResponse, createPlayer } from '../../helpers/builder'
import { GameScene } from '../../helpers/contracts'

describe('Error Response Helper', () => {
	it('should create error response for valid error name', () => {
		const errResponse = errorResponse(GameScene.GAME_NOT_FOUND)
		expect(errResponse).toHaveProperty('error')
		expect(errResponse).toHaveProperty('message')
		expect(errResponse.error).toBe('GAME_NOT_FOUND')
	})

	it('should create error response without an error name', () => {
		const errResponse = errorResponse()
		expect(errResponse).toHaveProperty('error')
		expect(errResponse).toHaveProperty('message')
		expect(errResponse.error).toBe('FALLBACK_ERROR_MESSAGE')
	})
})

describe('Create Player Helper', () => {
	it('should create Player with index', () => {
		const player = createPlayer(0)
		expect(player).toHaveProperty('id')
		expect(player).toHaveProperty('name')
		expect(player).toHaveProperty('isWinner')
		expect(player.id).toBe('0')
		expect(player.name).toBe('Player 1')
	})
})
