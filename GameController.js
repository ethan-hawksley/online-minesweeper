import Tile from './Tile.js';

export default class GameController {
  constructor() {
    this.element = document.createElement('div');
    this.grid = null;

    this.createGrid();
    this.setupTiles();
  }

  createGrid() {
    this.grid = [];
    for (let y = 0; y < 8; y++) {
      const row = [];
      for (let x = 0; x < 6; x++) {
        row.push(new Tile());
      }
      this.grid.push(row);
    }
  }

  setupTiles() {
    const gridElement = document.createElement('table');
    for (let y = 0; y < this.grid.length; y++) {
      const gridRow = this.grid[y];
      const gridRowElement = document.createElement('tr');
      for (let x = 0; x < gridRow.length; x++) {
        const gridDataElement = document.createElement('td');
        gridDataElement.append(gridRow[x].element);
        gridRowElement.append(gridDataElement);
      }
      gridElement.append(gridRowElement);
    }
    this.element.append(gridElement);
  }
}
