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
}
