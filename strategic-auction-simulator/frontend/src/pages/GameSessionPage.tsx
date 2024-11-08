import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { GameSocketClient } from '../utils/gameHelpers';
import {getAuth, onAuthStateChanged} from "firebase/auth";

import { User } from 'firebase/auth';

// Update interface for Contract
interface Contract {
  id: string;
  title: string;
  description: string;
  baseValue: number;
}

const GameSessionPage: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const auth = getAuth();
  const socketClient = GameSocketClient.getInstance();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    // Join the game session
    socketClient.joinGame(gameId);

    // Listen for contract updates
    const handleContractUpdate = (newContracts: Contract[]) => {
      setContracts(newContracts);
    };

    socketClient.onGameUpdate(handleContractUpdate);

    // Cleanup subscriptions
    return () => {
      unsubscribe();
      socketClient.cleanup();
    };
  }, [gameId, auth]);

  const handlePlaceBid = async (contractId: string) => {
    try {
      await socketClient.placeBid({
        gameId,
        playerId: user?.uid ?? '',
        contractId,
        bidAmount: currentBid
      });
    } catch (error) {
      console.error('Bid placement failed', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Game Session: {gameId}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5">Available Contracts</Typography>
              <List>
                {contracts.map(contract => (
                  <ListItem key={contract.id}>
                    <ListItemText
                      primary={contract.title}
                      secondary={`Base Value: SGD ${contract.baseValue}`}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePlaceBid(contract.id)}
                    >
                      Bid
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GameSessionPage;