import { Request, Response } from 'express';
import { GameSessionModel, IGameSession, IPlayer, IContract } from '../models/Game';
import OpenAIService from '../services/OpenAIService';
import { v4 as uuidv4 } from 'uuid';

export class GameController {
  async createGame(req: Request, res: Response) {
    try {
      const { players } = req.body;

      // Validate input
      if (!players || players.length < 2) {
        return res.status(400).json({
          error: 'At least two players are required to start a game'
        });
      }

      // Create new game session
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

  async submitContract(req: Request, res: Response) {
    try {
      const { gameId, playerId, contract } = req.body;

      // Validate input
      if (!gameId || !playerId || !contract) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Find game session
      const gameSession = await GameSessionModel.findById(gameId);
      if (!gameSession) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Enhance contract with AI evaluation
      const evaluatedContract = await OpenAIService.assessContractValue({
        ...contract,
        creator: playerId
      });

      // Add contract to game session
      const newContract: IContract = {
        ...contract,
        ...evaluatedContract,
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

  async placeBid(req: Request, res: Response) {
    try {
      const { gameId, playerId, contractId, bidAmount } = req.body;

      // Validate input
      if (!gameId || !playerId || !contractId || !bidAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Find game session
      const gameSession = await GameSessionModel.findById(gameId);
      if (!gameSession) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Find the contract
      const contract = gameSession.contracts.find(c => c.id === contractId);
      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Find the player
      const player = gameSession.players.find(p => p.id === playerId);
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      // Check if player has enough credits
      if (player.credits < bidAmount) {
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      // Update player's bid
      player.currentBids.push({ contractId, bidAmount });

      // Save updated game session
      await gameSession.save();

      res.status(200).json({
        message: 'Bid placed successfully',
        bid: { contractId, bidAmount }
      });
    } catch (error) {
      console.error('Bid Placement Error:', error);
      res.status(500).json({ error: 'Failed to place bid' });
    }
  }

  async concludeRound(req: Request, res: Response) {
    try {
      const { gameId } = req.body;

      // Find game session
      const gameSession = await GameSessionModel.findById(gameId);
      if (!gameSession) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Process bids and determine winners
      gameSession.contracts.forEach(contract => {
        const bids = gameSession.players
          .flatMap(player =>
            player.currentBids
              .filter(bid => bid.contractId === contract.id)
          )
          .sort((a, b) => b.bidAmount - a.bidAmount);

        // Highest bid wins
        if (bids.length > 0) {
          const winningBid = bids[0];
          const winningPlayer = gameSession.players.find(
            p => p.currentBids.includes(winningBid)
          );

          if (winningPlayer) {
            // Deduct credits from winner
            winningPlayer.credits -= winningBid.bidAmount;

            // Credit goes to contract creator
            const creatorPlayer = gameSession.players.find(
              p => p.id === contract.creator
            );

            if (creatorPlayer) {
              creatorPlayer.credits += winningBid.bidAmount * 0.5;
            }
          }
        }
      });

      // Increment round
      gameSession.currentRound++;

      // Save updated game session
      await gameSession.save();

      res.status(200).json({
        message: 'Round concluded successfully',
        round: gameSession.currentRound
      });
    } catch (error) {
      console.error('Round Conclusion Error:', error);
      res.status(500).json({ error: 'Failed to conclude round' });
    }
  }
}

export default new GameController();