export default class PlayGame {
  constructor(audioService) {
    // Create the HTML representation of the button
    this.element = document.createElement('div');

    const playGameButton = document.createElement('button');
    playGameButton.textContent = 'Play Game';
    // Assign class for consistent styling
    playGameButton.className = 'menu-button';

    playGameButton.addEventListener('click', () => {
      // Give audio feedback
      audioService.playAudio('button-click');
      // Dispatch startingGame, so that the MainMenu can collect the mode data and then broadcast startGame
      document.dispatchEvent(new CustomEvent('startingGame'));
    });

    document.addEventListener('connectionEstablished', (e) => {
      // Disable the play game button if the player is not the host
      if (!e.detail.isHost) {
        playGameButton.disabled = true;
      }
    });

    this.element.append(playGameButton);
  }
}
