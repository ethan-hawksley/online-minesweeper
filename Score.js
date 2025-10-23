export default class Score {
  constructor(mode, difficulty, modeSettings) {
    // Store parameters as attributes
    this.mode = mode;
    this.difficulty = difficulty;
    this.modeSettings = modeSettings;

    // Create element to represent the class
    this.element = document.createElement('div');
    this.scoreIndicator = document.createElement('h2');
    this.element.append(this.scoreIndicator);

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
}
