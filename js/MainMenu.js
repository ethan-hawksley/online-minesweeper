import MenuHeader from './MenuHeader.js';
import PlayGame from './PlayGame.js';
import ModeSelector from './ModeSelector.js';
import Settings from './Settings.js';
import MenuBestScore from './MenuBestScore.js';
import LobbySelector from './LobbySelector.js';

export default class MainMenu {
  constructor(connectionService, databaseService, audioService) {
    this.connectionService = connectionService;
    this.databaseService = databaseService;
    this.audioService = audioService;
    // Create element to contain sections of main menu
    this.element = document.createElement('div');

    // Initialise the parts of the main menu
    this.menuHeader = new MenuHeader();
    this.playGame = new PlayGame(this.audioService);
    this.lobbySelector = new LobbySelector(
      this.connectionService,
      this.audioService,
    );
    this.modeSelector = new ModeSelector(
      this.audioService,
      'standard',
      'classic',
    );
    this.menuBestScore = new MenuBestScore(
      this.audioService,
      this.databaseService,
    );
    this.settings = new Settings(this.audioService);

    // Display the elements of each part
    this.element.append(
      this.menuHeader.element,
      this.playGame.element,
      this.lobbySelector.element,
      this.modeSelector.element,
      this.menuBestScore.element,
      this.settings.element,
    );

    // Render the main menu
    document.getElementById('content').replaceChildren(this.element);

    this._onStartingGame = () => {
      const gameSettings = this.modeSelector.getGameSettings();
      // If connected, be the first player only half the time
      const isFirstPlayer =
        !this.connectionService.connected || Math.random() < 0.5;
      // Dispatch custom global event for the game to start. Contain the data for how the game should be played
      document.dispatchEvent(
        new CustomEvent('startGame', {
          detail: { isFirstPlayer, ...gameSettings },
        }),
      );
      // Destructure the gameSettings
      const { mode, difficulty, width, height, mineCount, modeSettings } =
        gameSettings;
      this.connectionService.startGame(
        mode,
        difficulty,
        width,
        height,
        mineCount,
        modeSettings,
        !isFirstPlayer,
      );
    };
    document.addEventListener('startingGame', this._onStartingGame);
  }

  destroy() {
    // Cleanup global listeners and elements
    this.playGame.destroy();
    this.lobbySelector.destroy();
    this.menuBestScore.destroy();
    document.removeEventListener('startingGame', this._onStartingGame);
    this.element.remove();
  }
}
