import MenuHeader from './MenuHeader.js';
import PlayGame from './PlayGame.js';

export default class MainMenu {
  constructor() {
    // Create element to contain sections of main menu
    this.element = document.createElement('div');

    this.menuHeader = new MenuHeader();
    this.playGame = new PlayGame();

    this.element.append(this.menuHeader.element, this.playGame.element);

    // Render the main menu
    document.getElementById('content').replaceChildren(this.element);
  }
}
