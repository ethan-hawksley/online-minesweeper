import MainMenu from './MainMenu.js';
import GameController from './GameController.js';
import DatabaseService from './DatabaseService.js';
import AudioService from './AudioService.js';

export default class State {
  constructor() {
    this.databaseService = new DatabaseService();
    this.audioService = new AudioService();
    // The Main Menu renders itself during initialisation
    this.mainMenu = null;
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

    this.startMainMenu();

    this.audioService.preload([
      'button-click',
      'game-over',
      'game-won',
      'tile-click',
    ]);
  }

  startGame(mode, difficulty, width, height, mineCount, modeSettings) {
    // Unload the main menu and load the game controller
    this.mainMenu = null;
    // Pass the settings for the game
    this.gameController = new GameController(
      this.databaseService,
      this.audioService,
      mode,
      difficulty,
      width,
      height,
      mineCount,
      modeSettings,
    );
  }

  startMainMenu() {
    // Unload the game controller and load the main menu
    this.gameController = null;
    this.mainMenu = new MainMenu(this.databaseService, this.audioService);
  }
}
