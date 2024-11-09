export type UserType = 'government' | 'business';

// Base user structure for shared properties
export interface BaseUser {
  username: string;
  userType: UserType;
  credits: number;
  joinedAt: string;

  contractsWon: string[];
}

// Government User structure
export interface GovernmentUser extends BaseUser {
  userType: 'government';
  stats: {
    contractsActive: string[];
    contractsTotal: number;
    totalSpent: number;
    winRate: number;
  };
  organization: {
    name: string;
    description: string;
    sector: string;
    budget: number;
    sustainabilityGoal: number; // 0-100
  };
}

// Business User structure
export interface BusinessUser extends BaseUser {
  userType: 'business';
  stats: {
    sustainabilityScore: number;
    contractsCreated: number;
    totalProfit: number;
    contractCompletionRate: number;
    activeContracts: string[];
    completedContracts: string[];
  };
  company: {
    name: string;
    description: string;
    expertise: string[];
    yearsOfExperience: number;
    certifications?: string[];
  };
}

export type User = BusinessUser | GovernmentUser;

export interface Bid {
  userId: string;
  amount: number;
  timestamp: string;
}

export interface Contract {
  status: 'active' | 'expired' | 'completed';
  bids: Record<string, Bid>;  // userId -> Bid
  winner?: string;
  winningBid?: number;

  agencies: string;
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdByBusiness: string; // Username of the business that created it
  requirements: string[];
  sustainability: number;
  expectedDuration: number;
  bidDuration: number; // in minutes

  trueValue: number;
  minimumBid: number;
  expirationTime: string; // ISO string
  credited: boolean;

  AI_info: OpenAIResponse;

  // maybe-unused
  sustainabilityRating?: number; // Added post-completion
  completionStatus?: 'completed' | 'delayed' | 'failed';
  governmentRating?: number; // Business rates government's work
  contractorRating?: number; // Government rates business's contract
}

export interface OpenAIResponsePartial {
  value: number;
  reasoning: string;
}

export interface OpenAIResponse {
  value: number;
  reasoning: string;
  analysis: string;
}

export type Role = 'system' | 'user' | 'assistant';

export type Message = {
  role: Role;
  content: string;
}

export type Messages = Message[];