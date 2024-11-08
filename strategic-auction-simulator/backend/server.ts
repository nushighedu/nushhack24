import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';

// Import routes
import gameRoutes from './routes/GameRoutes';
import WebSocketService from './services/WebSocketService';

// Load environment variables
require('dotenv').config({ path: require('find-config')('.env') });

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/strategic-auction', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/game', gameRoutes);

// Initialize WebSocket
WebSocketService.initialize(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});