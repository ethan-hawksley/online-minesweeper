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
      const { mode, difficulty, width, height, mineCount, modeSettings } =
        e.detail.gameSettings;
      // Start the game with the passed properties
      this.startGame(mode, difficulty, width, height, mineCount, modeSettings);
    });
    document.addEventListener('startMainMenu', () => {
      this.startMainMenu();
    });
  }

  startGame(mode, difficulty, width, height, mineCount, modeSettings) {
    // Unload the main menu and load the game controller
    this.mainMenu = null;
    // Pass the settings for the game
    this.gameController = new GameController(
      mode,
      difficulty,
      width,
      height,
      mineCount,
      modeSettings,
    );
  }

  startMainMenu() {
    this.gameController = null;
    this.mainMenu = new MainMenu();
  }
}
