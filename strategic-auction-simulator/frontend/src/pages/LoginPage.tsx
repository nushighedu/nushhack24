import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await AuthService.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{
        marginTop: 8,
        'flex-direction': 'column',
        alignItems: 'center',
        padding: 3
      }}>
        <Typography component="h1" variant="h5">
          Strategic Auction Simulator
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegister}
            sx={{ mt: 1 }}
          >
            Register New Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;