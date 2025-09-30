import Tile from './Tile.js';

export default class GameController {
  constructor() {
    // Create div element to store HTML
    this.element = document.createElement('div');
    this.grid = null;
    this.height = 8;
    this.width = 6;
    this.mineCount = 7;

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

        gridRowElement.append(gridDataElement);
      }
      // Add the row to the grid
      gridElement.append(gridRowElement);
    }
    // Show the grid on the element
    this.element.append(gridElement);
  }

  setupMineLocations() {
    // Empty array of positions
    const positions = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Fill array with all x and y coordinates
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

  revealTile(y, x) {
    // Call the revealTile method on the Tile object
    this.grid[y][x].revealTile();
  }
}
