export default class LobbySelector {
  constructor(connectionService, audioService) {
    // Store arguments as attributes
    this.connectionService = connectionService;
    this.audioService = audioService;

    // Create element to encapsulate lobby controls
    this.element = document.createElement('div');

    // Create button for creating lobbies
    this.createLobbyButton = document.createElement('button');
    this.createLobbyButton.className = 'menu-button';
    this.createLobbyButton.textContent = 'Create Lobby';

    this.createLobbyButton.addEventListener('click', () => {
      this.audioService.playAudio('button-click');
      // Create a new lobby
      this.connectionService.createLobby();
    });

    // Create elements for joining lobbies
    this.joinLobbyButton = document.createElement('button');
    this.joinLobbyButton.className = 'menu-button';
    this.joinLobbyButton.textContent = 'Join Lobby';

    this.joinCodeTextbox = document.createElement('input');
    this.joinCodeTextbox.className = 'menu-textbox';
    this.joinCodeTextbox.placeholder = 'Enter join code...';

    this.joinLobbyButton.addEventListener('click', () => {
      this.audioService.playAudio('button-click');
      // Attempt to connect to a lobby
      this.connectionService.joinLobby(this.joinCodeTextbox.value);
      // Reset the textbox so its empty
      this.joinCodeTextbox.value = '';
    });

    this.element.append(
      this.createLobbyButton,
      this.joinLobbyButton,
      this.joinCodeTextbox,
    );
  }
}
