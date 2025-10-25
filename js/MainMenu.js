import MenuHeader from './MenuHeader.js';
import PlayGame from './PlayGame.js';
import ModeSelector from './ModeSelector.js';
import Settings from './Settings.js';
import MenuBestScore from './MenuBestScore.js';

export default class MainMenu {
  constructor(databaseService, audioService) {
    this.databaseService = databaseService;
    this.audioService = audioService;
    // Create element to contain sections of main menu
    this.element = document.createElement('div');

    // Initialise the parts of the main menu
    this.menuHeader = new MenuHeader();
    this.playGame = new PlayGame(this.audioService);
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
      this.modeSelector.element,
      this.menuBestScore.element,
      this.settings.element,
    );

    // Render the main menu
    document.getElementById('content').replaceChildren(this.element);

    document.addEventListener('startingGame', () => {
      // Dispatch custom global event for the game to start. Contain the data for how the game should be played
      document.dispatchEvent(
        new CustomEvent('startGame', {
          detail: { gameSettings: this.modeSelector.getGameSettings() },
        }),
      );
    });
  }
}
