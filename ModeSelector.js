import DifficultySelector from './DifficultySelector.js';

export default class ModeSelector {
  constructor(initialDifficulty, initialMode) {
    this.selectedMode = null;
    this.element = document.createElement('div');

    this.difficultySelector = new DifficultySelector(
      initialDifficulty,
      initialMode,
    );

    this.classicModeButton = document.createElement('button');
    this.classicModeButton.textContent = 'Classic';

    this.timeAttackModeButton = document.createElement('button');
    this.timeAttackModeButton.textContent = 'Time Attack';

    this.element.append(
      this.classicModeButton,
      this.timeAttackModeButton,
      this.difficultySelector.element,
    );
  }

  setMode(mode) {
    this.selectedMode = mode;
    this.difficultySelector.setMode(mode);
    this.classicModeButton.classList.toggle('selected', mode === 'classic');
    this.timeAttackModeButton.classList.toggle(
      'selected',
      mode === 'timeAttack',
    );
  }

  getMode() {
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
          `Invalid mode ${this.difficultySelector.selectedDifficulty}`,
        );
    }

    return {
      mode: this.selectedMode,
      ...difficulty,
    };
  }
}
