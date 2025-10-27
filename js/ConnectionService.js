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
    this.isHost = true;
    // Track whether connected to a peer
    this.connected = false;
  }

  createLobby() {
    console.log('Creating lobby');
    // Create random six-digit ID concatenated with 'mineduo' to avoid collisions
    this.peer = new Peer(
      Math.random().toString().substring(2, 10) + 'mineduo',
      {
        host: 'peerjs.ethanhawksley.hackclub.app',
        path: '/myapp',
        secure: true,
      },
    );
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
      if (this.peer) {
        console.warn(
          'Disconnected from the PeerJS server. Attempting to reconnect...',
        );
        this.peer.reconnect();
      } else {
        console.warn('Disconnected from the PeerJS server.');
      }
    });

    this.peer.on('close', () => {
      console.log('Connection to the PeerJS server has been closed.');
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });

    this.peer.on('error', (error) => {
      console.error('Error during connection:', error);
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });
  }

  joinLobby(gameId) {
    console.log('Joining lobby', gameId);
    this.isHost = false;

    this.peer = new Peer({
      host: 'peerjs.ethanhawksley.hackclub.app',
      path: '/myapp',
      secure: true,
    });

    this.peer.on('open', () => {
      // When peer is ready, connect to host
      this.connection = this.peer.connect(gameId + 'mineduo');
      this.handleConnection();
    });

    this.peer.on('disconnected', () => {
      // When disconnected from the server due to network issues
      if (this.peer) {
        console.warn(
          'Disconnected from the PeerJS server. Attempting to reconnect...',
        );
        this.peer.reconnect();
      } else {
        console.warn('Disconnected from the PeerJS server.');
      }
    });

    // Don't dispatch event for this
    this.peer.on('close', () => {
      // When connection is gracefully closed
      console.log('Connection to the PeerJS server has been closed.');
      this.reset();
    });

    this.peer.on('error', (error) => {
      // When an unknown error occurs
      console.error('Error during connection:', error);
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });
  }

  handleConnection() {
    this.connection.on('open', () => {
      // When connection is opened between host and member
      console.log('Connection open');
      // Update the connected state
      this.connected = true;
      document.dispatchEvent(
        new CustomEvent('connectionEstablished', {
          detail: { isHost: this.isHost },
        }),
      );
    });

    this.connection.on('data', (data) => {
      // When a packet is received from the peer
      console.log('Data received:', data);
      this.handleIncomingData(data);
    });

    this.connection.on('close', () => {
      // When the connection is intentionally closed
      console.log('Connection to the other user has been closed.');
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });

    this.connection.on('error', (error) => {
      // When an unknown error occurs
      console.error('Error during connection:', error);
      document.dispatchEvent(new CustomEvent('connectionLost'));
      this.reset();
    });
  }

  handleIncomingData(data) {
    // Only allow specific events to be sent for security
    const allowedNetworkEvents = new Set([
      'startGame',
      'firstRevealTile',
      'revealTile',
      'flagTile',
      'unflagTile',
    ]);
    if (allowedNetworkEvents.has(data.type)) {
      // Dispatch event to the whole game
      document.dispatchEvent(
        new CustomEvent(data.type, { detail: data.content }),
      );
    } else {
      // Error when a non-allowed type is received
      console.error('Invalid data received:', data);
    }
  }

  startGame(
    mode,
    difficulty,
    width,
    height,
    mineCount,
    modeSettings,
    isFirstPlayer,
  ) {
    // Inform the peer that the game has started
    this.connection?.send({
      type: 'startGame',
      content: {
        mode,
        difficulty,
        width,
        height,
        mineCount,
        modeSettings,
        isFirstPlayer,
      },
    });
  }

  firstRevealTile(y, x, minePositions) {
    // Reveal a tile to the peer and inform where the mines are located
    this.connection?.send({
      type: 'firstRevealTile',
      content: {
        y,
        x,
        minePositions,
      },
    });
  }

  revealTile(y, x) {
    // Reveal a tile to the peer
    this.connection?.send({
      type: 'revealTile',
      content: {
        y,
        x,
      },
    });
  }

  flagTile(y, x) {
    this.connection?.send({
      type: 'flagTile',
      content: {
        y,
        x,
      },
    });
  }

  unflagTile(y, x) {
    this.connection?.send({
      type: 'unflagTile',
      content: {
        y,
        x,
      },
    });
  }
}
