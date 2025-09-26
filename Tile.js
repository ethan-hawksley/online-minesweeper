export default class Tile {
  constructor() {
    // Create HTML button for the tile
    this.element = document.createElement('button');
    this.element.className = 'tile';
    this.element.textContent = '';

    this.isRevealed = false;
  }

  revealTile() {
    this.isRevealed = true;
    this.element.classList.add('revealed');
  }
}
