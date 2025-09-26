export default class MenuHeader {
  constructor() {
    this.element = document.createElement('div');

    // Create title for main menu
    const title = document.createElement('h1');
    title.textContent = 'MineDuo';

    this.element.append(title);
  }
}