import MainMenu from './MainMenu.js';
import GameController from './GameController.js';

export default class State {
  constructor() {
    // The Main Menu renders itself during initialisation
    this.mainMenu = new MainMenu();
    this.gameController = null;

    // React to the Start Game button being pressed
    document.addEventListener('startGame', () => {
      this.startGame();
    });
    document.addEventListener('startMainMenu', () => {
      this.startMainMenu();
    });
  }

  startGame() {
    // Unload the main menu and load the game controller
    this.mainMenu = null;
    this.gameController = new GameController();
  }

  startMainMenu() {
    this.gameController = null;
    this.mainMenu = new MainMenu();
  }
}
