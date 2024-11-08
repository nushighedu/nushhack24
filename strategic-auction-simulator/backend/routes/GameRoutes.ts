import express from 'express';
import GameController from '../controllers/GameController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Middleware to authenticate all game routes
router.use(authenticateUser);

// Game Creation and Management Routes
router.post('/create', GameController.createGame);
router.post('/submit-contract', GameController.submitContract);
router.post('/place-bid', GameController.placeBid);
router.post('/conclude-round', GameController.concludeRound);

// Additional helper routes can be added here
router.get('/active-games', (req, res) => {
  // Retrieve list of active games
});

router.get('/game-history', (req, res) => {
  // Retrieve game history for a player
});

// Fetch all games in waiting status
router.get('/list', GameController.listGames);
router.post('/join', GameController.joinGame);

export default router;