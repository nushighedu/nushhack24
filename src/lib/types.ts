export type UserType = 'government' | 'business';

export interface BaseUser {
  username: string;
  userType: UserType;
  joinedAt: string;
  credits: number;
}

export interface GovernmentUser extends BaseUser {
  userType: 'government';
  stats: {
    contractsWon: number;
    totalProfit: number;
    successRate: number;
    reputation: number; // 0-100
    activeContracts: string[];
    completedContracts: string[];
  };
  company: {
    name: string;
    description: string;
    expertise: string[];
    yearsOfExperience: number;
    certifications: string[];
  };
}

export interface BusinessUser extends BaseUser {
  userType: 'business';
  stats: {
    contractsCreated: number;
    totalSpent: number;
    completionRate: number;
    averageSustainability: number;
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

export type User = GovernmentUser | BusinessUser;

export interface Contract {
  // ... existing Contract interface ...
  createdByBusiness: string; // username of business that created it
  sustainabilityRating?: number; // added post-completion
  completionStatus?: 'completed' | 'delayed' | 'failed';
  governmentRating?: number; // business rates government's work
  contractorRating?: number; // government rates business's contract
}