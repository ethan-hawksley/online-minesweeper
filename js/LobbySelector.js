export default class LobbySelector {
  constructor(connectionService, audioService) {
    // Store arguments as attributes
    this.connectionService = connectionService;
    this.audioService = audioService;

    this.gameId = null;

    // Create element to encapsulate lobby controls
    this.element = document.createElement('div');

    // Create button for creating lobbies
    this.createLobbyButton = document.createElement('button');
    this.createLobbyButton.className = 'menu-button';
    this.createLobbyButton.textContent = 'Create Lobby';

    this.createLobbyButton.addEventListener('click', () => {
      this.createLobbyButton.disabled = true;
      this.joinLobbyButton.disabled = true;
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
      this.joinLobby();
    });

    this.joinCodeTextbox.addEventListener('keydown', (e) => {
      // If enter pressed in the textbox
      if (e.key === 'Enter') {
        this.joinLobby();
      }
    });

    this.element.append(
      this.createLobbyButton,
      this.joinLobbyButton,
      this.joinCodeTextbox,
    );

    // Create modal to show the result of lobby creation
    this.lobbyCreatedModal = document.createElement('dialog');
    this.lobbyCreatedModal.className = 'menu-modal';

    this.lobbyCreatedText = document.createElement('p');

    this.copyToClipboardButton = document.createElement('button');
    this.copyToClipboardButton.textContent = 'Copy To Clipboard';
    this.copyToClipboardButton.addEventListener('click', async () => {
      try {
        // Attempt to write the game ID to the clipboard
        await navigator.clipboard.writeText(this.gameId);
        // Close the modal
        this.lobbyCreatedModal.close();
      } catch (e) {
        console.error('Error whilst writing to clipboard', e);
      }
    });

    this.closeModalButton = document.createElement('button');
    this.closeModalButton.textContent = 'Ok';
    this.closeModalButton.addEventListener('click', () => {
      // Close the modal
      this.lobbyCreatedModal.close();
    });

    this.lobbyCreatedModal.append(
      this.lobbyCreatedText,
      this.copyToClipboardButton,
      this.closeModalButton,
    );

    // Add the modal to the page
    document.body.append(this.lobbyCreatedModal);

    this._onLobbyCreated = async (e) => {
      // Extract the game ID from the event details
      this.gameId = e.detail.gameId;
      this.lobbyCreatedText.textContent = `Lobby created with ID ${this.gameId}`;
      this.lobbyCreatedModal.showModal();
    };
    document.addEventListener('lobbyCreated', this._onLobbyCreated);

    this._onConnectionLost = () => {
      this.createLobbyButton.disabled = false;
      this.joinLobbyButton.disabled = false;
      this.joinCodeTextbox.disabled = false;
    };
    document.addEventListener('connectionLost', this._onConnectionLost);
  }

  destroy() {
    // Cleanup global listeners and elements
    document.removeEventListener('lobbyCreated', this._onLobbyCreated);
    document.removeEventListener('connectionLost', this._onConnectionLost);
    this.lobbyCreatedModal.remove();
  }

  joinLobby() {
    const gameId = this.joinCodeTextbox.value;
    // Reset the textbox so its empty
    this.joinCodeTextbox.value = '';
    if (!gameId) {
      // If no code is entered
      alert('Please enter a code');
      return;
    }
    if (gameId.length !== 8) {
      // If a code of the wrong length is entered
      alert('Please enter a valid 8 digit code');
      return;
    }
    this.createLobbyButton.disabled = true;
    this.joinLobbyButton.disabled = true;
    this.joinCodeTextbox.disabled = true;
    this.audioService.playAudio('button-click');
    // Attempt to connect to the lobby
    this.connectionService.joinLobby(gameId);
  }
}
