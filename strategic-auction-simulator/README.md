# Strategic Auction Simulator

## Game Concept
A multiplayer strategy game simulating government infrastructure contract bidding in Singapore.

## Features
- Real-time multiplayer gameplay
- AI-powered contract valuation
- Dynamic risk assessment
- Secure authentication

## Technology Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Real-time Communication: Socket.io
- Authentication: Firebase
- Database: MongoDB
- AI Integration: OpenAI

## Prerequisites
- Node.js (v16+)
- MongoDB
- Firebase Account
- OpenAI API Key

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/nushighedu/nushhack24
cd nushhack24/strategic-auction-simulator
````

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the required environment variables:
- MongoDB connection string
- Firebase credentials
- OpenAI API key

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory with Firebase and backend configuration.

### 4. Run the Application
Terminal 1 (Backend):
```bash
npm run start:backend
```

Terminal 2 (Frontend):
```bash
npm run start:frontend
```

## Gameplay Instructions
1. Register/Login
2. Create or Join a Game
3. Submit Infrastructure Contract Proposals
4. Bid on Contracts
5. Strategize and Win!