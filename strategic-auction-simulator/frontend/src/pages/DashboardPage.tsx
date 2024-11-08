import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {GameSocketClient} from "../utils/gameHelpers";
import {Card, CardContent, Container, Grid, Typography} from "@mui/material";

// Update interface for GameSession
interface GameSession {
  id: string;
  players: string[];
  status: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);
  const auth = getAuth();
  const socketClient = GameSocketClient.getInstance();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleCreateGame = async () => {
    try {
      const newGame = await socketClient.createGame({
        creator: user?.uid ?? '',
        players: user?.uid ? [user.uid] : []
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
        playerId: user?.uid ?? ''
      });
      console.log('Contract submitted:', submittedContract);
    } catch (error) {
      console.error('Failed to submit contract', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.displayName ?? 'Player'}
      </Typography>

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
    </Container>
  );
};

export default DashboardPage;