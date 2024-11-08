import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { GameSocketClient } from '../utils/gameHelpers';
import { User } from 'firebase/auth';

interface GameSession {
  id: string;
  players: number;
  status: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeGames, setActiveGames] = useState<GameSession[]>([]);
  const auth = getAuth();
  const navigate = useNavigate();
  const socketClient = GameSocketClient.getInstance();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch active games
    fetch('/api/game/list', { method: 'GET' })
        .then(response => response.json())
         .then(data => setActiveGames(data))
         .catch(error => console.error('Failed to fetch games:', error));

    return () => unsubscribe();
  }, [auth]);

  const handleCreateGame = async () => {
    try {
      const creator = user?.uid;
      const newGame = await socketClient.createGame({ creator, players: [creator] });
      // @ts-ignore
      navigate(`/game/${newGame.id}`);
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    console.log('Joining game:', gameId);
    try {
      await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerId: user?.uid })
      });
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.displayName ?? 'Player'}
      </Typography>

      {/* Create Game Button */}
      <Button variant="contained" color="primary" onClick={handleCreateGame} sx={{ mb: 3 }}>
        Create New Game
      </Button>

      {/* Active Games List */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Join a Game</Typography>
            <List>
              {activeGames.map((game) => (
                <ListItem key={game.id}>
                  <ListItemText
                    primary={`Game ID: ${game.id}`}
                    secondary={`Players: ${game.players}`}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleJoinGame(game.id)}
                  >
                    Join
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default DashboardPage;