const Constants = {
	apiEndpoints: {
		createGame: '{apiUrl}/api/v1/createGame/{level}',
		joinGame: '{apiUrl}/api/v1/{gameId}/join',
		getInfo: '{apiUrl}/api/v1/{gameId}/info',
		checkStatus: '{apiUrl}/api/v1/{gameId}/status',
		makeMove: '{apiUrl}/api/v1/{gameId}/move',
		removePlayer: '{apiUrl}/api/v1/{gameId}/remove/{id}',
	},
	base: 'http://localhost:5000',
	socketUrl: 'http://localhost:4000',
	confettiConfig: {
		angle: 90,
		spread: 180,
		startVelocity: 27,
		elementCount: 150,
		dragFriction: 0.12,
		duration: 2900,
		stagger: 3,
		width: "10px",
		height: "10px",
		perspective: "500px",
		colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
	}
}
export default Constants
