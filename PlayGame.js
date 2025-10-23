export default class PlayGame {
  constructor() {
    // Create the HTML representation of the button
    this.element = document.createElement('div');

    const playGameButton = document.createElement('button');
    playGameButton.textContent = 'Play Game';

    // Dispatch a global event when pressed, so that the state can respond to it
    playGameButton.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('startGame'));
    });

    this.element.append(playGameButton);
  }
}
