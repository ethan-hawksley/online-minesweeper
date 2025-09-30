export default class Tile {
  constructor() {
    // Create HTML button for the tile
    this.element = document.createElement('button');
    this.element.className = 'tile';
    this.element.textContent = '';

    this.isRevealed = false;
    this.isMine = false;
  }

  revealTile() {
    this.isRevealed = true;
    this.element.classList.add('revealed');
    if (this.isMine) {
      this.element.classList.add('mine');
      this.element.textContent = '💣';
    }
  }
}
