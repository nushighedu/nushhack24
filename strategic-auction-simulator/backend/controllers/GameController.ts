import { Request, Response } from 'express';
import { GameSessionModel, IGameSession } from '../models/Game';
import { v4 as uuidv4 } from 'uuid';

// Constants
const MAX_PLAYERS = 10;

export class GameController {
  // Create a new game session
  async createGame(req: Request, res: Response) {
    console.log('GameController createGame:', req.body);
    try {
      const { players } = req.body;

      const gameSession: IGameSession = {
        id: uuidv4(),
        players: players.map((player: any) => ({
          id: player.id,
          username: player.username,
          credits: 3000,
          contracts: [],
          loans: 0,
          currentBids: []
        })),
        currentRound: 0,
        contracts: [],
        status: 'WAITING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const savedGame = await GameSessionModel.create(gameSession);

      res.status(201).json({
        message: 'Game created successfully',
        gameId: savedGame.id
      });
    } catch (error) {
      console.error('Game Creation Error:', error);
      res.status(500).json({ error: 'Failed to create game' });
    }
  }

  // Submit a contract
  async submitContract(req: Request, res: Response) {
    try {
      const { gameId, playerId, contract } = req.body;

      if (!gameId || !playerId || !contract) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const gameSession = await GameSessionModel.findById(gameId);

      if (!gameSession) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const newContract = {
        ...contract,
        creator: playerId,
        id: uuidv4()
      };

      gameSession.contracts.push(newContract);
      await gameSession.save();

      res.status(201).json({
        message: 'Contract submitted successfully',
        contract: newContract
      });
    } catch (error) {
      console.error('Contract Submission Error:', error);
      res.status(500).json({ error: 'Failed to submit contract' });
    }
  }

  // List active games
  async listGames(req: Request, res: Response) {
    try {
      const games = await GameSessionModel.find({ status: 'WAITING' });
      res.status(200).json(games);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list games' });
    }
  }

  // Join a game
  async joinGame(req: Request, res: Response) {
    try {
      const { gameId, playerId } = req.body;

      const gameSession = await GameSessionModel.findById(gameId);

      if (!gameSession || gameSession.status !== 'WAITING') {
        return res.status(404).json({ error: 'Game not found or already started' });
      }

      if (gameSession.players.length >= MAX_PLAYERS) {
        return res.status(400).json({ error: 'Game is full' });
      }

      const existingPlayer = gameSession.players.find(p => p.id === playerId);

      if (!existingPlayer) {
        gameSession.players.push({
          id: playerId,
          username: 'Anonymous', // Ideally, fetch actual username from auth data
          credits: 3000,
          contracts: [],
          loans: 0,
          currentBids: []
        });
        await gameSession.save();
      }

      res.status(200).json({ message: 'Joined game successfully', gameId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to join game' });
    }
  }

  async placeBid(req: Request, res: Response) {
    try {
      const { gameId, playerId, contractId, bidAmount } = req.body;

      if (!gameId || !playerId || !contractId || !bidAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const gameSession = await GameSessionModel.findById(gameId);

      if (!gameSession) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const contract = gameSession.contracts.find(c => c.id === contractId);

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      if (contract.creator === playerId) {
        return res.status(400).json({ error: 'Cannot bid on own contract' });
      }

      const player = gameSession.players.find(p => p.id === playerId);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      if (player.credits < bidAmount) {
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      player.currentBids.push({ contractId, bidAmount });

      await gameSession.save();

      res.status(201).json({
        message: 'Bid placed successfully',
        bid: { contractId, playerId, amount: bidAmount }
      });
    } catch (error) {
      console.error('Bid Placement Error:', error);
      res.status(500).json({ error: 'Failed to place bid' });
    }
  }

  async concludeRound(req: Request, res: Response) {
    try {
      const { gameId } = req.body;

      if (!gameId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const gameSession = await GameSessionModel.findById(gameId);

      if (!gameSession) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // TODO: Implement round conclusion logic here

      res.status(200).json({ message: 'Round concluded successfully' });
    } catch (error) {
      console.error('Round Conclusion Error:', error);
      res.status(500).json({ error: 'Failed to conclude round' });
    }
  }

}

export default new GameController();