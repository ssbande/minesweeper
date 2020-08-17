
import GameManager from "./GameManager";

class Manager {
  private game: GameManager;
  
  public getGameManager() {
    if (!this.game) this.game = new GameManager();
    return this.game;
  }
}

let manager: Manager;

function getManager() {
  if (!manager) manager = new Manager();
  return manager;
}

export default getManager;