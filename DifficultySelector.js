export default class DifficultySelector {
  constructor(initialDifficulty, initialMode) {
    // Start with no difficulty
    this.selectedDifficulty = null;

    // Create element to encapsulate all parts of module
    this.element = document.createElement('div');

    // Create a button for each difficulty mode
    this.standardDifficultyButton = document.createElement('button');
    this.standardDifficultyButton.textContent = 'Standard';

    this.hardDifficultyButton = document.createElement('button');
    this.hardDifficultyButton.textContent = 'Hard';

    this.expertDifficultyButton = document.createElement('button');
    this.expertDifficultyButton.textContent = 'Expert';

    this.customDifficultyButton = document.createElement('button');
    this.customDifficultyButton.textContent = 'Custom';

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
    this.customWidthDiv.append(this.customWidthLabel, this.customWidthInput);

    this.customHeightDiv = document.createElement('div');
    this.customHeightLabel = document.createElement('label');
    this.customHeightLabel.setAttribute('for', 'custom-height');
    this.customHeightLabel.textContent = 'Height:';
    this.customHeightInput = document.createElement('input');
    this.customHeightInput.id = 'custom-height';
    this.customHeightInput.type = 'number';
    this.customHeightDiv.append(this.customHeightLabel, this.customHeightInput);

    this.customMineCountDiv = document.createElement('div');
    this.customMineCountLabel = document.createElement('label');
    this.customMineCountLabel.setAttribute('for', 'custom-mine-count');
    this.customMineCountLabel.textContent = 'Mines:';
    this.customMineCountInput = document.createElement('input');
    this.customMineCountInput.id = 'custom-mine-count';
    this.customMineCountInput.type = 'number';
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
    this.customTimeLimitDiv.append(
      this.customTimeLimitLabel,
      this.customTimeLimitInput,
    );

    // When buttons are clicked, set the difficulty to the corresponding one
    this.standardDifficultyButton.addEventListener('click', () => {
      this.select('standard');
    });
    this.hardDifficultyButton.addEventListener('click', () => {
      this.select('hard');
    });
    this.expertDifficultyButton.addEventListener('click', () => {
      this.select('expert');
    });
    this.customDifficultyButton.addEventListener('click', () => {
      this.select('custom');
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
    this.select(initialDifficulty);
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
    // Fetch and return the values of the custom inputs
    return {
      width: Number(this.customWidthInput.value),
      height: Number(this.customHeightInput.value),
      mineCount: Number(this.customMineCountInput.value),
      timeLimit: Number(this.customTimeLimitInput.value),
    };
  }
}
