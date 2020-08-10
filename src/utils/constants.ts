const Constants = {
	base: 'http://localhost:5000',
	apiEndpoints: {
		createGame: '{apiUrl}/api/v1/createGame/{level}',
		joinGame: '{apiUrl}/api/v1/{gameId}/join',
		getInfo: '{apiUrl}/api/v1/{gameId}/info',
		checkStatus: '{apiUrl}/api/v1/{gameId}/status',
		makeMove: '{apiUrl}/api/v1/{gameId}/move',
		removePlayer: '{apiUrl}/api/v1/{gameId}/remove/{id}',
	},
}
export default Constants
