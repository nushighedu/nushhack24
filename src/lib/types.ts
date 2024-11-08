export interface Player {
    id: string;
    name: string;
    credits: number;
    company: Company;
  }
  
  export interface Company {
    name: string;
    description: string;
    expertise: string[];
    yearsOfExperience: number;
    previousProjects: string[];
  }
  
  export interface Contract {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    requirements: string[];
    sustainability: number;
    expectedDuration: number;
    trueValue: number;
    minimumBid: number;
    status: 'pending' | 'active' | 'sold';
    winner?: string;
    winningBid?: number;
  }

export interface OpenAIResponse1 {
  value: number;
  reasoning: string;
}