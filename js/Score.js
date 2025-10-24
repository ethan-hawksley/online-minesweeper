import BestScore from './BestScore.js';

export default class Score {
  constructor(databaseService, mode, difficulty, modeSettings) {
    // Store parameters as attributes
    this.databaseService = databaseService;
    this.mode = mode;
    this.difficulty = difficulty;
    this.modeSettings = modeSettings;

    // Create element to represent the class
    this.element = document.createElement('div');
    this.scoreIndicator = document.createElement('h2');

    // Initialise BestScore
    this.bestScore = new BestScore(databaseService, mode, difficulty);

    // Display the composite elements
    this.element.append(this.scoreIndicator, this.bestScore.element);

    // Initialise variables as null
    this.score = null;
    this.interval = null;

    // Use the correct behaviour for
    switch (mode) {
      case 'classic':
        this.classicMode();
        break;
      case 'timeAttack':
        this.timeAttackMode();
        break;
      default:
        // Throw error for an invalid code
        throw new Error(`Invalid mode: ${mode}`);
    }
  }

  classicMode() {
    // Score starts counting from 0
    // Lowest score is the best
    this.score = 0;
    this.scoreIndicator.textContent = 'Time: 0';
    // Every second, increment the score
    this.interval = setInterval(() => {
      this.score++;
      this.scoreIndicator.textContent = `Time: ${this.score}`;
    }, 1000 /* 1 second */);
  }

  timeAttackMode() {
    // Score starts at the time limit and counts down
    // The aim is to beat the board before running out of time
    // Highest score is the best
    this.score = this.modeSettings.timeLimit;
    this.scoreIndicator.textContent = `Time: ${this.score}`;
    // Each second, decrement the score
    this.interval = setInterval(() => {
      this.score--;
      this.scoreIndicator.textContent = `Time: ${this.score}`;
      // If score runs out, end the game
      if (this.score <= 0) {
        document.dispatchEvent(new CustomEvent('gameOver'));
      }
    }, 1000 /* 1 second */);
  }

  tileRevealed() {
    const REVEALED_TILE_TIME_BONUS = 5;
    if (this.mode === 'timeAttack') {
      // Add additional time when tiles are revealed in time attack mode
      this.score += REVEALED_TILE_TIME_BONUS;
    }
  }

  gameOver() {
    // Stop modifying the score
    clearInterval(this.interval);
  }

  gameWon() {
    // Stop modifying the score
    clearInterval(this.interval);
    // See if a new best score has just been set
    this.bestScore.checkBestScore(this.score);
  }
}
