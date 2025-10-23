import Tile from './Tile.js';

export default class GameController {
  constructor(_mode, width, height, mineCount, _timeLimit) {
    // Create div element to store HTML
    this.element = document.createElement('div');
    this.grid = null;
    this.height = height;
    this.width = width;
    this.mineCount = mineCount;
    this.tilesLeft = this.height * this.width - this.mineCount;
    this.firstClick = true;
    this.active = true;

    this.createGrid();
    this.setupTiles();
    this.setupMineLocations();

    // Render the game element
    document.getElementById('content').replaceChildren(this.element);
  }

  createGrid() {
    this.grid = [];
    // Create a grid of tiles 8 high and 6 wide
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Tile());
      }
      this.grid.push(row);
    }
  }

  setupTiles() {
    const gridElement = document.createElement('table');
    // Create a table of buttons y high and x wide
    for (let y = 0; y < this.height; y++) {
      const gridRow = this.grid[y];
      const gridRowElement = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const gridDataElement = document.createElement('td');
        // Display the element of the tile
        gridDataElement.append(gridRow[x].element);

        // When tile clicked, reveal the tile
        gridDataElement.addEventListener('click', () => {
          this.revealTile(y, x);
        });

        // When tile right-clicked, flag the tile
        gridDataElement.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.toggleFlag(y, x);
        });

        gridRowElement.append(gridDataElement);
      }
      // Add the row to the grid
      gridElement.append(gridRowElement);
    }
    // Show the grid on the element
    this.element.append(gridElement);
  }

  setupMineLocations(safeY, safeX) {
    // Empty array of positions
    const positions = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Fill array with all x and y coordinates
        if (y === safeY && x === safeX) continue;
        positions.push({ y, x });
      }
    }

    // Perform the Fisher-Yates shuffle algorithm to shuffle all the indexes.
    for (
      let swapFromIndex = 0;
      swapFromIndex < positions.length;
      swapFromIndex++
    ) {
      const swapToIndex = Math.floor(Math.random() * positions.length);
      const temp = positions[swapFromIndex];
      positions[swapFromIndex] = positions[swapToIndex];
      positions[swapToIndex] = temp;
    }

    // Select the required amount of coordinates to set as mines.
    for (let i = 0; i < this.mineCount; i++) {
      const mine = positions.pop();
      this.grid[mine.y][mine.x].isMine = true;
    }
  }

  getAdjacentCoordinates(y, x) {
    // Create empty array for adjacent coordinates
    const adjacentCoordinates = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        // Iterate over all adjacent x and y positions
        if (dy === 0 && dx === 0) continue;

        const newY = y + dy;
        const newX = x + dx;

        // If the new coordinates are in bounds, add the coordinate as adjacent
        if (newY >= 0 && newY < this.height && newX >= 0 && newX < this.width) {
          adjacentCoordinates.push({ y: newY, x: newX });
        }
      }
    }
    return adjacentCoordinates;
  }

  revealTile(y, x) {
    if (!this.active) {
      // Do not reveal tiles when the game is over
      return;
    }
    if (this.firstClick) {
      // Setup mines so that the first click is safe
      this.setupMineLocations(y, x);
      this.firstClick = false;
    }

    const selectedTile = this.grid[y][x];
    if (selectedTile.isRevealed) {
      // Do not reveal a tile twice
      return;
    }
    if (selectedTile.isFlagged) {
      // Do not reveal flagged tiles
      return;
    }

    const adjacentCoordinates = this.getAdjacentCoordinates(y, x);
    // Initialise count at 0
    let adjacentMines = 0;
    for (const coordinate of adjacentCoordinates) {
      if (this.grid[coordinate.y][coordinate.x].isMine) {
        // Count how many adjacent tiles are mines
        adjacentMines++;
      }
    }

    selectedTile.revealTile(adjacentMines);

    if (selectedTile.isMine) {
      // End the game if a mine is clicked
      this.gameOver();
      return;
    }
    // Decrement the number of tiles left
    this.tilesLeft--;

    // If there are no adjacent mines, reveal all adjacent tiles
    if (adjacentMines === 0) {
      for (const coordinate of adjacentCoordinates) {
        this.revealTile(coordinate.y, coordinate.x);
      }
    }

    // If all non-mine tiles have been revealed
    if (this.tilesLeft === 0) {
      this.gameWon();
    }
  }

  toggleFlag(y, x) {
    const selectedTile = this.grid[y][x];
    // Do not flag a tile that's already revealed
    if (selectedTile.isRevealed) return;

    if (selectedTile.isFlagged) {
      selectedTile.unflagTile();
    } else {
      selectedTile.flagTile();
    }
  }

  gameOver() {
    // Disable the game running
    this.active = false;
    setTimeout(() => {
      // Dispatch a global event so that the main menu starts
      document.dispatchEvent(new CustomEvent('startMainMenu'));
    }, 5000 /* 5 seconds */);
  }

  gameWon() {
    // Disable the game running
    this.active = false;
    setTimeout(() => {
      // Dispatch a global event so that the main menu starts
      document.dispatchEvent(new CustomEvent('startMainMenu'));
    }, 5000 /* 5 seconds */);
  }
}
