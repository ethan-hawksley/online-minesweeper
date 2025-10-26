// Import PeerJS from external CDN
import { Peer } from 'https://esm.sh/peerjs@1.5.5?bundle-deps';

export default class ConnectionService {
  constructor() {
    // Set up initial attributes
    this.reset();
  }

  reset() {
    if (this.peer) {
      // Destroy any existing connections
      this.peer.destroy();
    }
    this.peer = null;
    this.connection = null;
    this.gameId = null;
    this.isHost = false;
    this.gameInProgress = false;
  }

  createLobby() {
    console.log('Creating lobby');
    // Create random six-digit ID concatenated with 'mineduo' to avoid collisions
    this.peer = new Peer(Math.random().toString().substring(2, 8) + 'mineduo');
    this.peer.on('open', (gameId) => {
      console.log('Peer opened with id', gameId);
      // Remove mineduo from id
      this.gameId = gameId.slice(0, -7);
      console.log(this.gameId);
      this.isHost = true;
      document.dispatchEvent(
        new CustomEvent('lobbyCreated', { detail: { gameId: this.gameId } }),
      );
    });

    this.peer.on('connection', (connection) => {
      // When a member connects
      this.connection = connection;
      this.handleConnection();
    });

    this.peer.on('disconnected', () => {
      // When disconnected from the server due to network issues
      console.warn(
        'Disconnected from the PeerJS server. Attempting to reconnect...',
      );
      this.peer.reconnect();
    });

    this.peer.on('close', () => {
      console.log('Connection to the PeerJS server has been closed.');
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });

    this.peer.on('error', (error) => {
      console.error('Error during connection', error);
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });
  }

  joinLobby(gameId) {
    console.log('Joining lobby', gameId);
    this.peer = new Peer();

    this.peer.on('open', () => {
      // When peer is ready, connect to host
      this.connection = this.peer.connect(gameId + 'mineduo');
      this.handleConnection();
    });

    this.peer.on('disconnected', () => {
      // When disconnected from the server due to network issues
      console.warn(
        'Disconnected from the PeerJS server. Attempting to reconnect...',
      );
      this.peer.reconnect();
    });

    this.peer.on('close', () => {
      // When connection is gracefully closed
      console.log('Connection to the PeerJS server has been closed.');
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });

    this.peer.on('error', (error) => {
      // When an unknown error occurs
      console.error('Error during connection', error);
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });
  }

  handleConnection() {
    this.connection.on('open', () => {
      // When connection is opened between host and member
      console.log('Connection open');
      document.dispatchEvent(
        new CustomEvent('connectionEstablished', {
          detail: { isHost: this.isHost },
        }),
      );
    });

    this.connection.on('data', (data) => {
      // Handle data
      console.log('Data received', data);
    });
  }
}
