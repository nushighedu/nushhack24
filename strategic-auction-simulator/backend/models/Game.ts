import mongoose from 'mongoose';

export interface IContract {
  id?: string;
  creator: string;
  title: string;
  description: string;
  baseValue: number;
  actualValue?: number;
  risks: string[];
  sustainability: number;
  completionProbability: number;
}

export interface IPlayer {
  id: string;
  username: string;
  credits: number;
  contracts: IContract[];
  loans: number;
  currentBids: {
    contractId: string;
    bidAmount: number;
  }[];
}

export interface IGameSession {
  id: string;
  players: IPlayer[];
  currentRound: number;
  contracts: IContract[];
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema Definitions
const ContractSchema = new mongoose.Schema<IContract>({
  creator: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  baseValue: { type: Number, required: true },
  actualValue: { type: Number },
  risks: [{ type: String }],
  sustainability: { type: Number, default: 0 },
  completionProbability: { type: Number, default: 0.5 }
});

const PlayerSchema = new mongoose.Schema<IPlayer>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  credits: { type: Number, default: 3000 },
  contracts: [ContractSchema],
  loans: { type: Number, default: 0 },
  currentBids: [{
    contractId: { type: String },
    bidAmount: { type: Number }
  }]
});

const GameSessionSchema = new mongoose.Schema<IGameSession>({
  players: [PlayerSchema],
  currentRound: { type: Number, default: 0 },
  contracts: [ContractSchema],
  status: {
    type: String,
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'WAITING'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ContractModel = mongoose.model<IContract>('Contract', ContractSchema);
export const PlayerModel = mongoose.model<IPlayer>('Player', PlayerSchema);
export const GameSessionModel = mongoose.model<IGameSession>('GameSession', GameSessionSchema);