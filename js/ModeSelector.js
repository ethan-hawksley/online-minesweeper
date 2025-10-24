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
    this.classicModeButton.className = 'menu-button';

    this.timeAttackModeButton = document.createElement('button');
    this.timeAttackModeButton.textContent = 'Time Attack';
    this.timeAttackModeButton.className = 'menu-button';

    this.classicModeButton.addEventListener('click', () => {
      this.setMode('classic');
    });

    this.timeAttackModeButton.addEventListener('click', () => {
      this.setMode('timeAttack');
    });

    // Append all HTML elements to the main element
    this.element.append(
      this.classicModeButton,
      this.timeAttackModeButton,
      this.difficultySelector.element,
    );

    this.setMode(initialMode);
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

  getGameSettings() {
    // Gather the correct difficulty settings for the mode
    const difficulty = this.difficultySelector.selectedDifficulty;
    let options = {};
    switch (difficulty) {
      case 'standard':
        options = {
          width: 7,
          height: 7,
          mineCount: 6,
          modeSettings: {
            timeLimit: 200,
          },
        };
        break;
      case 'hard':
        options = {
          width: 11,
          height: 11,
          mineCount: 15,
          modeSettings: {
            timeLimit: 400,
          },
        };
        break;
      case 'expert':
        options = {
          width: 18,
          height: 14,
          mineCount: 30,
          modeSettings: {
            timeLimit: 700,
          },
        };
        break;
      case 'custom':
        options = this.difficultySelector.getCustomOptions();
        break;
      default:
        throw new Error(
          `Invalid mode: ${this.difficultySelector.selectedDifficulty}`,
        );
    }

    // Return all the details about the game
    return {
      mode: this.selectedMode,
      difficulty,
      ...options,
    };
  }
}
