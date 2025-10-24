import Score from './Score.js';

export default class ScoreManager {
  constructor(databaseService, mode, difficulty, modeSettings) {
    // Create element to encapsulate the contents of the class
    this.element = document.createElement('div');

    // Initialise the score so that the player's score can be changed
    this.score = new Score(databaseService, mode, difficulty, modeSettings);

    // Show the score class on the page
    this.element.append(this.score.element);
  }

  gameWon() {
    this.score.gameWon();
  }

  gameOver() {
    this.score.gameOver();
  }
}
