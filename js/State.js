import MainMenu from './MainMenu.js';
import GameController from './GameController.js';
import DatabaseService from './DatabaseService.js';
import AudioService from './AudioService.js';
import ConnectionService from './ConnectionService.js';

export default class State {
  constructor() {
    this.connectionService = new ConnectionService();
    this.databaseService = new DatabaseService();
    this.audioService = new AudioService();
    // The Main Menu renders itself during initialisation
    this.mainMenu = null;
    this.gameController = null;

    // React to the Start Game button being pressed
    document.addEventListener('startGame', (e) => {
      // Destructure the properties passed in the event
      const {
        mode,
        difficulty,
        width,
        height,
        mineCount,
        modeSettings,
        isFirstPlayer,
      } = e.detail;
      // Start the game with the passed properties
      this.startGame(
        mode,
        difficulty,
        width,
        height,
        mineCount,
        modeSettings,
        isFirstPlayer,
      );
    });
    document.addEventListener('startMainMenu', () => {
      this.startMainMenu();
    });

    document.addEventListener('connectionEstablished', () => {
      // Inform the user a connection has been made
      this.createModal('Connected');
    });

    document.addEventListener('connectionLost', () => {
      // Inform the user a connection has been lost
      this.createModal('Connection Lost');
    });

    this.startMainMenu();

    this.audioService.preload([
      'button-click',
      'game-over',
      'game-won',
      'tile-click',
    ]);
  }

  startGame(
    mode,
    difficulty,
    width,
    height,
    mineCount,
    modeSettings,
    isFirstPlayer,
  ) {
    // Unload the main menu and load the game controller
    if (this.mainMenu) {
      // Destroy event listeners and elements
      this.mainMenu.destroy();
    }
    this.mainMenu = null;
    // Pass the settings for the game
    this.gameController = new GameController(
      this.connectionService,
      this.databaseService,
      this.audioService,
      mode,
      difficulty,
      width,
      height,
      mineCount,
      modeSettings,
      isFirstPlayer,
    );
  }

  startMainMenu() {
    // Unload the game controller and load the main menu
    if (this.gameController) {
      // Destroy event listeners and elements
      this.gameController.destroy();
    }
    this.gameController = null;
    // Pass the services for the main menu
    this.mainMenu = new MainMenu(
      this.connectionService,
      this.databaseService,
      this.audioService,
    );
  }

  createModal(message) {
    // Create modal element
    const modal = document.createElement('dialog');
    modal.className = 'menu-modal';
    // Create element for message
    const p = document.createElement('p');
    p.textContent = message;
    // Create close button
    const button = document.createElement('button');
    button.className = 'menu-button';
    button.textContent = 'Ok';
    button.addEventListener('click', () => {
      // When clicked, delete the modal
      modal.remove();
    });
    modal.append(p, button);
    document.body.append(modal);
    modal.showModal();
  }
}
