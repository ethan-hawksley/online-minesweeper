import Tile from './Tile.js';
import ScoreManager from './ScoreManager.js';

export default class GameController {
  constructor(
    connectionService,
    databaseService,
    audioService,
    mode,
    difficulty,
    width,
    height,
    mineCount,
    modeSettings,
    isFirstPlayer,
  ) {
    // Store passed arguments as attributes for later use
    this.connectionService = connectionService;
    this.databaseService = databaseService;
    this.audioService = audioService;
    this.mode = mode;
    this.difficulty = difficulty;
    this.height = height;
    this.width = width;
    this.mineCount = mineCount;
    this.modeSettings = modeSettings;
    this.isFirstPlayer = isFirstPlayer;

    this.grid = null;
    this.tilesLeft = this.height * this.width - this.mineCount;
    this.firstClick = true;
    this.active = isFirstPlayer;

    // Create div element to store HTML
    this.element = document.createElement('div');

    // Create title to show name of game
    const title = document.createElement('h1');
    title.textContent = 'MineDuo';

    // Initialise ScoreManager
    this.scoreManager = new ScoreManager(
      this.databaseService,
      this.mode,
      this.difficulty,
      this.modeSettings,
    );

    this.createGrid();
    this.tiles = this.setupTiles();

    this.element.append(title, this.scoreManager.element, this.tiles);
    // Render the game element
    document.getElementById('content').replaceChildren(this.element);

    // Listen for the gameOver event broadcasted by the Score
    document.addEventListener('gameOver', () => this.gameOver());

    document.addEventListener('firstRevealTile', (e) => {
      // Place mines in the correct positions
      for (const position of e.detail.minePositions) {
        this.grid[position.y][position.x].isMine = true;
      }
      // Iterate through and enable all visibly disabled tiles
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.grid[y][x].enable();
        }
      }
      this.firstClick = false;
      // Enable interacting with the game
      this.active = true;
      this.revealTile(e.detail.y, e.detail.x, false, true);
    });

    document.addEventListener('revealTile', (e) => {
      // When receive a revealTile packet over the network
      this.revealTile(e.detail.y, e.detail.x, false, true);
    });

    document.addEventListener('flagTile', (e) => {
      this.flagTile(e.detail.y, e.detail.x, true);
    });

    document.addEventListener('unflagTile', (e) => {
      this.unflagTile(e.detail.y, e.detail.x);
    });
  }

  createGrid() {
    this.grid = [];
    // Create a grid of tiles 8 high and 6 wide
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Tile(this.isFirstPlayer));
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
          this.revealTile(y, x, true, false);
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
    return gridElement;
  }

  generateMinePositions(safeY, safeX) {
    // Empty array of positions
    const positions = [];
    // Fill array with all x and y coordinates
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Skip adding the safe coordinates
        if (y === safeY && x === safeX) continue;
        positions.push({ y, x });
      }
    }

    // Perform the Fisher-Yates shuffle algorithm to shuffle all the indexes
    // This ensures a linear time complexity
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

    return positions.slice(0, this.mineCount);
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

  revealTile(y, x, isBroadcasted, isForced) {
    // Do not reveal tiles when the game is over
    if (!this.active) return;

    const selectedTile = this.grid[y][x];

    // Do not reveal a tile twice
    if (selectedTile.isRevealed) return;
    // Do not reveal flagged tiles
    if (selectedTile.isFlagged) {
      if (isForced) {
        selectedTile.unflagTile();
      } else {
        return;
      }
    }

    if (this.firstClick) {
      // Setup mines so that the first click is safe
      const minePositions = this.generateMinePositions(y, x);
      for (const position of minePositions) {
        this.grid[position.y][position.x].isMine = true;
      }
      this.firstClick = false;
      if (isBroadcasted) {
        this.connectionService.firstRevealTile(y, x, minePositions);
      }
    } else {
      if (isBroadcasted) {
        this.connectionService.revealTile(y, x);
      }
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
    this.scoreManager.tileRevealed();

    // If there are no adjacent mines, reveal all adjacent tiles
    if (adjacentMines === 0) {
      for (const coordinate of adjacentCoordinates) {
        this.revealTile(coordinate.y, coordinate.x, false, false);
      }
    }

    // If all non-mine tiles have been revealed
    if (this.tilesLeft === 0) {
      this.gameWon();
    } else {
      // Give audio feedback only when the game hasn't ended
      this.audioService.playAudio('tile-click');
    }
  }

  toggleFlag(y, x) {
    // Do not reveal tiles when the game is over
    if (!this.active) return;

    const selectedTile = this.grid[y][x];
    if (selectedTile.isFlagged) {
      this.unflagTile(y, x);
    } else {
      this.flagTile(y, x, false);
    }
  }

  flagTile(y, x, isSecondary) {
    const selectedTile = this.grid[y][x];
    // Do not flag a tile that's already revealed
    if (!selectedTile.isRevealed) {
      selectedTile.flagTile(isSecondary);
      this.audioService.playAudio('tile-click');
    }
  }

  unflagTile(y, x) {
    const selectedTile = this.grid[y][x];
    // Do not unflag a tile that's already revealed
    if (!selectedTile.isRevealed) {
      selectedTile.flagTile(isSecondary);
      this.audioService.playAudio('tile-click');
    }
  }

  gameOver() {
    // Disable the game running
    this.active = false;
    // Play game over noise
    this.audioService.playAudio('game-over');
    // Call game over logic
    this.scoreManager.gameOver();
    setTimeout(() => {
      // Dispatch a global event so that the main menu starts
      document.dispatchEvent(new CustomEvent('startMainMenu'));
    }, 5000 /* 5 seconds */);
  }

  gameWon() {
    // Disable the game running
    this.active = false;
    // Play game won noise
    this.audioService.playAudio('game-won');
    // Call game won logic
    this.scoreManager.gameWon();
    setTimeout(() => {
      // Dispatch a global event so that the main menu starts
      document.dispatchEvent(new CustomEvent('startMainMenu'));
    }, 5000 /* 5 seconds */);
  }
}
