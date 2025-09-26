import MenuHeader from './MenuHeader.js';

export default class MainMenu {
  constructor() {
    // Create element to contain sections of main menu
    this.element = document.createElement('div');

    this.menuHeader = new MenuHeader();

    this.element.append(this.menuHeader.element);

    // Render the main menu
    document.getElementById('content').replaceChildren(this.element);
  }
}