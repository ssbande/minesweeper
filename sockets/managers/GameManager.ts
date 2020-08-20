class GameManager {
  private games: object;

  constructor() {
    this.games = {};
  }

  public addPlayerToGame(playerId: string, gameId: string) {
    this.games[gameId].push(playerId);
  }

  public addGame(gameId: string){
    this.games[gameId] = [];
  }

  public removeGame(gameId: string) {
    delete this.games[gameId];
  }

  public findGameByPlayerSocketId(playerSocketId: string): any {
    let gameId = '';
    Object.keys(this.games).forEach((game, id) => {
      if(this.games[game].find(player => player === playerSocketId)) {
        gameId = game;
      }
    })

    return gameId;
  }
}

export default GameManager;