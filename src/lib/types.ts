export type UserType = 'BUSINESS' | 'GOVERNMENT' | 'government' | 'business';

// Base user structure for shared properties
export interface BaseUser {
  username: string;
  userType: UserType;
  credits: number;
  joinedAt: string;
}

// Business User structure
export interface BusinessUser extends BaseUser {
  userType: 'BUSINESS' | 'business';
  stats: {
    contractsWon: number;
    totalProfit: number;
    successRate: number;
    averageBidAmount: number;
    competitionWinRate: number;
    activeContracts: string[];
    completedContracts: string[];
  };
  company: {
    name: string;
    description: string;
    expertise: string[];
    yearsOfExperience: number;
    previousProjects: string[];
    certifications?: string[];
  };
}

// Government User structure
export interface GovernmentUser extends BaseUser {
  userType: 'GOVERNMENT' | 'government';
  stats: {
    contractsCreated: number;
    totalSpent: number;
    averageContractValue: number;
    sustainabilityScore: number;
    contractCompletionRate: number;
    reputation?: number; // 0-100, added for extended flexibility
    activeContracts: string[];
    completedContracts: string[];
  };
  organization: {
    name: string;
    description: string;
    sector: string;
    budget: number;
    sustainabilityGoal: number; // 0-100
  };
}

export type User = BusinessUser | GovernmentUser;

export interface Bid {
  userId: string;
  amount: number;
  timestamp: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdByBusiness: string; // Username of the business that created it
  requirements: string[];
  sustainability: number;
  expectedDuration: number;
  trueValue: number;
  minimumBid: number;
  status: 'active' | 'expired' | 'completed';
  expirationTime: string; // ISO string
  bids: Record<string, Bid>; // userId -> Bid
  winner?: string;
  winningBid?: number;
  sustainabilityRating?: number; // Added post-completion
  completionStatus?: 'completed' | 'delayed' | 'failed';
  governmentRating?: number; // Business rates government's work
  contractorRating?: number; // Government rates business's contract
}
