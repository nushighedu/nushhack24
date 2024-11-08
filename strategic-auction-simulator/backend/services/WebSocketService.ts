import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { IGameSession } from '../models/Game';
import GameController from '../controllers/GameController';

class WebSocketService {
  private io: Server;

  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Game Session Events
      socket.on('create-game', async (gameConfig) => {
        try {
          const gameSession = await this.createGame(gameConfig);
          socket.emit('game-created', gameSession);
          socket.join(gameSession.id);
        } catch (error) {
          socket.emit('error', { message: 'Failed to create game' });
        }
      });

      socket.on('join-game', (gameId) => {
        socket.join(gameId);
        this.notifyGameJoined(gameId, socket);
      });

      socket.on('submit-contract', async (contractData) => {
        try {
          const contract = await this.submitContract(contractData);
          this.io.to(contractData.gameId).emit('contract-submitted', contract);
        } catch (error) {
          socket.emit('error', { message: 'Contract submission failed' });
        }
      });

      socket.on('place-bid', async (bidData) => {
        try {
          const bid = await this.placeBid(bidData);
          this.io.to(bidData.gameId).emit('bid-placed', bid);
        } catch (error) {
          socket.emit('error', { message: 'Bid placement failed' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async createGame(gameConfig: any): Promise<IGameSession> {
    // Implement game creation logic
    // This would typically call your GameController
    return await GameController.createGame(gameConfig);
  }

  private async submitContract(contractData: any) {
    // Implement contract submission logic
    return await GameController.submitContract(contractData);
  }

  private async placeBid(bidData: any) {
    // Implement bid placement logic
    return await GameController.placeBid(bidData);
  }

  private notifyGameJoined(gameId: string, socket: any) {
    // Notify other players in the game that someone joined
    socket.to(gameId).emit('player-joined', {
      gameId,
      playerId: socket.id
    });
  }

  // Broadcast game state updates
  broadcastGameUpdate(gameId: string, gameState: IGameSession) {
    this.io.to(gameId).emit('game-state-update', gameState);
  }

  // Send private message to a specific player
  sendPrivateMessage(playerId: string, message: any) {
    this.io.to(playerId).emit('private-message', message);
  }
}

export default new WebSocketService();