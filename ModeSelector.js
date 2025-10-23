import DifficultySelector from './DifficultySelector.js';

export default class ModeSelector {
  constructor(initialDifficulty, initialMode) {
    // Initially start with no selected mode
    this.selectedMode = null;
    // Create element to store all parts
    this.element = document.createElement('div');

    // Initialise the difficulty selector which is part of the mode selector
    this.difficultySelector = new DifficultySelector(
      initialDifficulty,
      initialMode,
    );

    // Create buttons for each mode
    this.classicModeButton = document.createElement('button');
    this.classicModeButton.textContent = 'Classic';

    this.timeAttackModeButton = document.createElement('button');
    this.timeAttackModeButton.textContent = 'Time Attack';

    // Append all HTML elements to the main element
    this.element.append(
      this.classicModeButton,
      this.timeAttackModeButton,
      this.difficultySelector.element,
    );
  }

  setMode(mode) {
    // Update the set mode
    this.selectedMode = mode;
    // Update the difficulty selector's options
    this.difficultySelector.setMode(mode);
    // Toggle the corresponding button
    this.classicModeButton.classList.toggle('selected', mode === 'classic');
    this.timeAttackModeButton.classList.toggle(
      'selected',
      mode === 'timeAttack',
    );
  }

  getMode() {
    // Gather the correct difficulty settings for the mode
    let difficulty = {};
    switch (this.difficultySelector.selectedDifficulty) {
      case 'standard':
        difficulty = {
          width: 9,
          height: 9,
          mineCount: 10,
          timeLimit: 200,
        };
        break;
      case 'hard':
        difficulty = {
          width: 16,
          height: 16,
          mineCount: 20,
          timeLimit: 400,
        };
        break;
      case 'expert':
        difficulty = {
          width: 30,
          height: 20,
          mineCount: 50,
          timeLimit: 700,
        };
        break;
      case 'custom':
        difficulty = this.difficultySelector.getCustomOptions();
        break;
      default:
        throw Error(
          `Invalid mode: ${this.difficultySelector.selectedDifficulty}`,
        );
    }

    // Return all the details about the game
    return {
      mode: this.selectedMode,
      ...difficulty,
    };
  }
}
