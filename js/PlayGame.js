export default class PlayGame {
  constructor(connectionService, audioService) {
    this.connectionService = connectionService;
    this.audioService = audioService;
    // Create the HTML representation of the button
    this.element = document.createElement('div');

    const playGameButton = document.createElement('button');
    playGameButton.textContent = 'Play Game';
    // Assign class for consistent styling
    playGameButton.className = 'menu-button';
    playGameButton.disabled = !this.connectionService.isHost;

    playGameButton.addEventListener('click', () => {
      // Give audio feedback
      this.audioService.playAudio('button-click');
      // Dispatch startingGame, so that the MainMenu can collect the mode data and then broadcast startGame
      document.dispatchEvent(new CustomEvent('startingGame'));
    });

    this._onConnectionEstablished = (e) => {
      // Disable the play game button if the player is not the host
      playGameButton.disabled = !e.detail.isHost;
    };
    document.addEventListener(
      'connectionEstablished',
      this._onConnectionEstablished,
    );

    this._onLobbyCreated = () => {
      playGameButton.disabled = true;
    };
    document.addEventListener('lobbyCreated', this._onLobbyCreated);

    this._onConnectionLost = () => {
      playGameButton.disabled = false;
    };
    document.addEventListener('connectionLost', this._onConnectionLost);

    this.element.append(playGameButton);
  }

  destroy() {
    // Cleanup global listeners
    document.removeEventListener(
      'connectionEstablished',
      this._onConnectionEstablished,
    );
    document.removeEventListener('lobbyCreated', this._onLobbyCreated);
    document.removeEventListener('connectionLost', this._onConnectionLost);
  }
}
