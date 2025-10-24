import Score from './Score.js';
import Streak from './Streak.js';

export default class ScoreManager {
  constructor(databaseService, mode, difficulty, modeSettings) {
    // Create element to encapsulate the contents of the class
    this.element = document.createElement('div');

    // Initialise the score so that the player's score can be changed
    this.score = new Score(databaseService, mode, difficulty, modeSettings);
    this.streak = new Streak(databaseService);

    // Show the score class on the page
    this.element.append(this.score.element, this.streak.element);
  }

  gameWon() {
    // Relay the game is won
    this.score.gameWon();
    this.streak.gameWon();
  }

  gameOver() {
    // Relay the game is over
    this.score.gameOver();
    this.streak.gameOver();
  }
}
