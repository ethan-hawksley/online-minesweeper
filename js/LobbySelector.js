export default class LobbySelector {
  constructor(connectionService, audioService) {
    this.connectionService = connectionService;
    this.audioService = audioService;

    this.element = document.createElement('div');

    this.createLobbyButton = document.createElement('button');
    this.createLobbyButton.className = 'menu-button';
    this.createLobbyButton.textContent = 'Create Lobby';

    this.createLobbyButton.addEventListener('click', () => {
      this.audioService.playAudio('button-click');
      this.connectionService.createLobby();
    });

    this.joinLobbyButton = document.createElement('button');
    this.joinLobbyButton.className = 'menu-button';
    this.joinLobbyButton.textContent = 'Join Lobby';

    this.joinCodeTextbox = document.createElement('input');
    this.joinCodeTextbox.className = 'menu-textbox';
    this.joinCodeTextbox.placeholder = 'Enter join code...';

    this.joinLobbyButton.addEventListener('click', () => {
      this.audioService.playAudio('button-click');
      this.connectionService.joinLobby(this.joinCodeTextbox.value);
    });

    this.element.append(
      this.createLobbyButton,
      this.joinLobbyButton,
      this.joinCodeTextbox,
    );
  }
}
