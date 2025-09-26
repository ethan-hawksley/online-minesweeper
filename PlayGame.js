export default class PlayGame {
  constructor() {
    this.element = document.createElement('div');

    const playGameButton = document.createElement('button');
    playGameButton.textContent = 'Play Game';

    playGameButton.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('startingGame'));
    });

    this.element.append(playGameButton);
  }
}