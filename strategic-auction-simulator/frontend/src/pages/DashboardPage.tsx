import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { ContractSubmissionForm } from '../components/ContractSubmissionForm';
import { GameSocketClient } from '../utils/gameHelpers';
import AuthService from '../services/AuthService';
import {getAuth, onAuthStateChanged} from "firebase/auth";

interface GameSession {
  id: string;
  players: any[];
  status: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState(null);
  const [activeSessions] = useState([]);
  const socketClient = GameSocketClient.getInstance();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    // Fetch active game sessions
    const fetchActiveSessions = async () => {
      try {
        // Placeholder for actual API call
        // const sessions = await gameService.getActiveSessions();
        // setActiveSessions(sessions);
      } catch (error) {
        console.error('Failed to fetch active sessions', error);
      }
    };

    fetchActiveSessions();

    // Listen for game updates
    socketClient.onGameUpdate((gameState) => {
      console.log('Game state updated:', gameState);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
      socketClient.cleanup();
    };
  }, [socketClient]);

  const handleCreateGame = async () => {
    try {
      const newGame = await socketClient.createGame({
        creator: user?.uid,
        players: [user?.uid]
      });
      console.log('Game created:', newGame);
    } catch (error) {
      console.error('Failed to create game', error);
    }
  };

  const handleContractSubmit = async (contractData: any) => {
    try {
      const submittedContract = await socketClient.submitContract({
        ...contractData,
        playerId: user?.uid
      });
      console.log('Contract submitted:', submittedContract);
    } catch (error) {
      console.error('Failed to submit contract', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.displayName || 'Player'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Create New Game</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateGame}
              >
                Create Game
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Active Game Sessions</Typography>
              {activeSessions.map(session => (
                <div key={session.id}>
                  <Typography>
                    Game {session.id} - {session.status}
                  </Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Submit Contract</Typography>
              <ContractSubmissionForm onSubmit={handleContractSubmit} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;