import { Peer } from 'https://esm.sh/peerjs@1.5.5?bundle-deps';

export default class ConnectionService {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.gameId = null;
    this.isHost = false;
    this.connected = false;
    this.gameInProgress = false;
  }

  createLobby() {
    console.log('Creating lobby');
    this.peer = new Peer();
    this.peer.on('open', (gameId) => {
      console.log('Peer opened with id', gameId);
      this.gameId = gameId;
      this.isHost = true;
      document.dispatchEvent(
        new CustomEvent('lobbyCreated', { detail: { gameId: gameId } }),
      );
    });

    this.peer.on('connection', (connection) => {
      console.log('Connection established with peer', connection);
      this.connection = connection;
      this.handleConnection();
    });

    this.peer.on('disconnected', () => {
      console.warn(
        'Disconnected from the PeerJS server. Attempting to reconnect...',
      );
    });

    this.peer.on('close', () => {
      console.error('Connection to the PeerJS server has been closed.');
      document.dispatchEvent(new CustomEvent('connectionLost'));
    });

    this.peer.on('error', (error) => {
      console.error('Error during connection', error);
      document.dispatchEvent(new CustomEvent('connectionLost'));
    });
  }

  joinLobby(gameId) {
    this.peer = new Peer();
    this.connection = this.peer.connect(gameId);
    this.handleConnection();
  }

  handleConnection() {
    this.connection.on('open', () => {
      console.log('Connection open');
      this.connected = true;
      document.dispatchEvent(
        new CustomEvent('connectionEstablished', {
          detail: { isHost: this.isHost },
        }),
      );
    });

    this.connection.on('data', (data) => {
      console.log('Data received', data);
    });
  }
}
