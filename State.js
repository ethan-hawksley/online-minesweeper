import MainMenu from './MainMenu.js';
import GameController from './GameController.js';

export default class State {
  constructor() {
    // The Main Menu renders itself during initialisation
    this.mainMenu = new MainMenu();
    this.gameController = null;

    document.addEventListener('gameStart', () => {
      this.startGame();
    });
  }

  startGame() {
    this.mainMenu = null;
    this.gameController = new GameController();
  }
}
