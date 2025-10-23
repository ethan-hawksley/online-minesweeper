import MainMenu from './MainMenu.js';
import GameController from './GameController.js';

export default class State {
  constructor() {
    // The Main Menu renders itself during initialisation
    this.mainMenu = new MainMenu();
    this.gameController = null;

    // React to the Start Game button being pressed
    document.addEventListener('startGame', (e) => {
      // Destructure the properties passed in the event
      const { mode, width, height, mineCount, timeLimit } =
        e.detail.gameSettings;
      this.startGame(mode, width, height, mineCount, timeLimit);
    });
    document.addEventListener('startMainMenu', () => {
      this.startMainMenu();
    });
  }

  startGame(mode, width, height, mineCount, timeLimit) {
    // Unload the main menu and load the game controller
    this.mainMenu = null;
    // Pass the settings for the game
    this.gameController = new GameController(
      mode,
      width,
      height,
      mineCount,
      timeLimit,
    );
  }

  startMainMenu() {
    this.gameController = null;
    this.mainMenu = new MainMenu();
  }
}
