export default class Streak {
  constructor(databaseService) {
    // Save the argument to an attribute
    this.databaseService = databaseService;

    // Create an HTML element to represent the class
    this.element = document.createElement('h2');
    this.element.textContent = 'Streak: ';

    this.showStreak();
  }

  async showStreak() {
    // Database functions are asynchronous so the function is also asynchronous
    try {
      this.streak = await this.databaseService.getStreak();
      // Update display to the current streak
      this.element.textContent = `Streak: ${this.streak}`;
    } catch (e) {
      console.error('Error encountered whilst fetching streak', e);
    }
  }

  async gameOver() {
    // Database functions are asynchronous so the function is also asynchronous
    try {
      // Reset the streak to 0
      await this.databaseService.updateStreak(0);
      // Display the new streak to the user
      this.element.textContent = 'Streak: 0';
    } catch (e) {
      console.error('Error encountered whilst resetting streak', e);
    }
  }

  async gameWon() {
    // Database functions are asynchronous so the function is also asynchronous
    try {
      // Increment the streak
      this.streak++;
      await this.databaseService.updateStreak(this.streak);
      // Display the new streak to the user
      this.element.textContent = `Streak: ${this.streak}`;
    } catch (e) {
      console.error('Error encountered whilst incrementing streak', e);
    }
  }
}
