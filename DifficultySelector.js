export default class DifficultySelector {
  constructor(initialDifficulty, initialMode) {
    // Start with no difficulty
    this.selectedDifficulty = null;

    // Create element to encapsulate all parts of module
    this.element = document.createElement('div');

    // Create a button for each difficulty mode
    this.standardDifficultyButton = document.createElement('button');
    this.standardDifficultyButton.textContent = 'Standard';
    this.standardDifficultyButton.className = 'menu-button';

    this.hardDifficultyButton = document.createElement('button');
    this.hardDifficultyButton.textContent = 'Hard';
    this.hardDifficultyButton.className = 'menu-button';

    this.expertDifficultyButton = document.createElement('button');
    this.expertDifficultyButton.textContent = 'Expert';
    this.expertDifficultyButton.className = 'menu-button';

    this.customDifficultyButton = document.createElement('button');
    this.customDifficultyButton.textContent = 'Custom';
    this.customDifficultyButton.className = 'menu-button';

    // Create element to encapsulate all the parts that can change in custom difficulty
    this.customDifficultyDiv = document.createElement('div');

    // Create elements to encapsulate each label and input
    this.customWidthDiv = document.createElement('div');
    this.customWidthLabel = document.createElement('label');
    this.customWidthLabel.setAttribute('for', 'custom-width');
    this.customWidthLabel.textContent = 'Width:';
    this.customWidthInput = document.createElement('input');
    this.customWidthInput.id = 'custom-width';
    this.customWidthInput.type = 'number';
    this.customWidthInput.value = '1';
    this.customWidthInput.min = '1';
    this.customWidthDiv.append(this.customWidthLabel, this.customWidthInput);

    this.customHeightDiv = document.createElement('div');
    this.customHeightLabel = document.createElement('label');
    this.customHeightLabel.setAttribute('for', 'custom-height');
    this.customHeightLabel.textContent = 'Height:';
    this.customHeightInput = document.createElement('input');
    this.customHeightInput.id = 'custom-height';
    this.customHeightInput.type = 'number';
    this.customHeightInput.value = '1';
    this.customHeightInput.min = '1';
    this.customHeightDiv.append(this.customHeightLabel, this.customHeightInput);

    this.customMineCountDiv = document.createElement('div');
    this.customMineCountLabel = document.createElement('label');
    this.customMineCountLabel.setAttribute('for', 'custom-mine-count');
    this.customMineCountLabel.textContent = 'Mines:';
    this.customMineCountInput = document.createElement('input');
    this.customMineCountInput.id = 'custom-mine-count';
    this.customMineCountInput.type = 'number';
    this.customMineCountInput.value = '1';
    this.customMineCountInput.min = '1';
    this.customMineCountDiv.append(
      this.customMineCountLabel,
      this.customMineCountInput,
    );

    this.customTimeLimitDiv = document.createElement('div');
    this.customTimeLimitLabel = document.createElement('label');
    this.customTimeLimitLabel.setAttribute('for', 'custom-time-limit');
    this.customTimeLimitLabel.textContent = 'Time Limit:';
    this.customTimeLimitInput = document.createElement('input');
    this.customTimeLimitInput.id = 'custom-time-limit';
    this.customTimeLimitInput.type = 'number';
    this.customTimeLimitInput.value = '1';
    this.customTimeLimitInput.min = '1';
    this.customTimeLimitDiv.append(
      this.customTimeLimitLabel,
      this.customTimeLimitInput,
    );

    // When buttons are clicked, set the difficulty to the corresponding one
    this.standardDifficultyButton.addEventListener('click', () => {
      this.setDifficulty('standard');
    });
    this.hardDifficultyButton.addEventListener('click', () => {
      this.setDifficulty('hard');
    });
    this.expertDifficultyButton.addEventListener('click', () => {
      this.setDifficulty('expert');
    });
    this.customDifficultyButton.addEventListener('click', () => {
      this.setDifficulty('custom');
    });

    // Add all subparts to their parent element
    this.customDifficultyDiv.append(
      this.customWidthDiv,
      this.customHeightDiv,
      this.customMineCountDiv,
      this.customTimeLimitDiv,
    );

    this.element.append(
      this.standardDifficultyButton,
      this.hardDifficultyButton,
      this.expertDifficultyButton,
      this.customDifficultyButton,
      this.customDifficultyDiv,
    );

    // Initialise the selector with the initial difficulty state
    this.setDifficulty(initialDifficulty);
    this.setMode(initialMode);
  }

  setDifficulty(difficulty) {
    this.selectedDifficulty = difficulty;
    // Toggle each element to the correct difficulty
    if (difficulty === 'standard') {
      this.standardDifficultyButton.classList.add('selected');
    } else {
      this.standardDifficultyButton.classList.remove('selected');
    }
    if (difficulty === 'hard') {
      this.hardDifficultyButton.classList.add('selected');
    } else {
      this.hardDifficultyButton.classList.remove('selected');
    }
    if (difficulty === 'expert') {
      this.expertDifficultyButton.classList.add('selected');
    } else {
      this.expertDifficultyButton.classList.remove('selected');
    }
    if (difficulty === 'custom') {
      this.customDifficultyButton.classList.add('selected');
      // Show and hide the element when relevant
      this.customDifficultyDiv.hidden = false;
    } else {
      this.customDifficultyButton.classList.remove('selected');
      this.customDifficultyDiv.hidden = true;
    }
  }

  setMode(mode) {
    // Show and hide relevant custom options
    this.customTimeLimitDiv.hidden = mode !== 'timeAttack';
  }

  getCustomOptions() {
    const parseAndValidate = (value) => {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue) || parsedValue <= 0) {
        return 1;
      }
      return parsedValue;
    };
    return {
      width: parseAndValidate(this.customWidthInput.value),
      height: parseAndValidate(this.customHeightInput.value),
      mineCount: parseAndValidate(this.customMineCountInput.value),
      timeLimit: parseAndValidate(this.customTimeLimitInput.value),
    };
  }
}
