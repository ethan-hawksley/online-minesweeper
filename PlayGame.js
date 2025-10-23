export default class PlayGame {
  constructor() {
    // Create the HTML representation of the button
    this.element = document.createElement('div');

    const playGameButton = document.createElement('button');
    playGameButton.textContent = 'Play Game';
    // Assign class for consistent styling
    playGameButton.className = 'menu-button';

    playGameButton.addEventListener('click', () => {
      // Dispatch startingGame, so that the MainMenu can collect the mode data and then broadcast startGame
      document.dispatchEvent(new CustomEvent('startingGame'));
    });

    this.element.append(playGameButton);
  }
}
