import MenuHeader from './MenuHeader.js';
import PlayGame from './PlayGame.js';
import ModeSelector from './ModeSelector.js';

export default class MainMenu {
  constructor() {
    // Create element to contain sections of main menu
    this.element = document.createElement('div');

    // Initialise the parts of the main menu
    this.menuHeader = new MenuHeader();
    this.playGame = new PlayGame();
    this.modeSelector = new ModeSelector('standard', 'classic');

    // Display the elements of each part
    this.element.append(
      this.menuHeader.element,
      this.playGame.element,
      this.modeSelector.element,
    );

    // Render the main menu
    document.getElementById('content').replaceChildren(this.element);
  }
}
