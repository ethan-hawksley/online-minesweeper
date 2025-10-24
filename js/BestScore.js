export default class BestScore {
  constructor(databaseService, mode, difficulty) {
    // Store the values passed into the class
    this.databaseService = databaseService;
    this.mode = mode;
    this.difficulty = difficulty;

    // Initially the best score is null, before fetching the value from the database service
    this.bestScore = null;

    // Create element to display the best score to the player
    this.element = document.createElement('h2');
    this.element.textContent = 'Best Score: ';
    this.element.hidden = this.difficulty === 'custom';

    // Fetch the best score from the database service
    this.showBestScore();
  }

  async showBestScore() {
    // Database functions are asynchronous so the function is also asynchronous
    try {
      this.bestScore = await this.databaseService.getBestScore(
        this.mode,
        this.difficulty,
      );
      // Update display to the best score
      this.element.textContent = `Best Score: ${this.bestScore}`;
    } catch (e) {
      console.error('Error encountered whilst fetching best score', e);
    }
  }

  checkBestScore(score) {
    if (this.difficulty === 'custom') {
      // Custom difficulties do not save best scores
      return;
    }
    // Different modes either prioritise a high score or a low score
    switch (this.mode) {
      case 'classic':
        // Classic mode - lower score the better
        if (score < this.bestScore) {
          this.setBestScore(score);
        }
        break;
      case 'timeAttack':
        // Time Attack mode - higher score the better
        if (score > this.bestScore) {
          this.setBestScore(score);
        }
        break;
      default:
        console.error('Invalid mode', this.mode);
        break;
    }
  }

  async setBestScore(score) {
    try {
      // Update the database's held best score value
      await this.databaseService.updateBestScore(
        this.mode,
        this.difficulty,
        score,
      );
      // Update held best score
      this.bestScore = score;
      // Render new best score
      this.element.textContent = `Best Score: ${this.bestScore}`;
    } catch (e) {
      console.error('Error whilst setting best score', e);
    }
  }
}
