export default class Tile {
  constructor() {
    // Create HTML button for the tile
    this.element = document.createElement('button');
    this.element.className = 'tile';
    this.element.textContent = '';

    this.isRevealed = false;
    this.isMine = false;
    this.isFlagged = false;
  }

  revealTile(adjacentMineCount) {
    this.isRevealed = true;
    // Change appearance to revealed tile
    this.element.classList.add('revealed');
    if (this.isMine) {
      this.element.classList.add('mine');
      this.element.textContent = '💣';
    } else {
      // Show adjacent number of mines
      this.element.classList.add('mines' + adjacentMineCount.toString());
      if (adjacentMineCount) {
        this.element.textContent = adjacentMineCount.toString();
      }
    }
  }

  flagTile() {
    this.isFlagged = true;
    // Show a flag symbol on the tile
    this.element.textContent = '🚩';
    this.element.classList.add('flagged');
  }

  unflagTile() {
    this.isFlagged = false;
    // Hide any currently shown symbols on the tile
    this.element.textContent = '';
    this.element.classList.remove('flagged');
  }
}
