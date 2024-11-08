import { io, Socket } from 'socket.io-client';

export class GameSocketClient {
  private socket: Socket;
  private static instance: GameSocketClient;

  private constructor() {
    this.socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('authToken')
      }
    });

    this.setupListeners();
  }

  public static getInstance(): GameSocketClient {
    if (!GameSocketClient.instance) {
      GameSocketClient.instance = new GameSocketClient();
    }
    return GameSocketClient.instance;
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to game server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket Error:', error);
    });
  }

  public createGame(gameConfig: any) {
    return new Promise((resolve, reject) => {
      console.log("Socket create-game:", gameConfig);
      this.socket.emit('create-game', gameConfig);
      this.socket.once('game-created', resolve);
      this.socket.once('error', reject);
    });
  }

  public joinGame(gameId: string) {
    this.socket.emit('join-game', gameId);
  }

  public submitContract(contractData: any) {
    return new Promise((resolve, reject) => {
      this.socket.emit('submit-contract', contractData);
      this.socket.once('contract-submitted', resolve);
      this.socket.once('error', reject);
    });
  }

  public placeBid(bidData: any) {
    return new Promise((resolve, reject) => {
      this.socket.emit('place-bid', bidData);
      this.socket.once('bid-placed', resolve);
      this.socket.once('error', reject);
    });
  }

  public onGameUpdate(callback: (gameState: any) => void) {
    this.socket.on('game-state-update', callback);
  }

  public cleanup() {
    this.socket.off('connect');
    this.socket.off('disconnect');
    this.socket.off('error');
    this.socket.off('game-state-update');
  }
}