# Strategic Auction Simulator

A modern take on government infrastructure bidding, built for a hackathon with the theme "Modernise an existing system/process, making it secure and future-ready".

## Overview
This game simulates the bidding process for infrastructure projects in Singapore, where players can:
- Create their own companies and submit contract proposals
- Bid on other players' contracts
- Manage their credits and strategy
- Compete for the highest returns

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- TailwindCSS
- ESLint
- Shadcn/UI Components

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start playing.

## Game Rules
1. Each player starts with 3,000 credits
2. Players can create companies and submit contract proposals
3. Contract values are determined by system algorithms
4. Players bid on contracts without knowing their true value
5. Contract creators receive 50% of the winning bid
6. The game ends when all contracts have been auctioned
7. Winner is determined by total credits + contract values

## Project Structure
```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/        # Shadcn UI components
│   ├── game/      # Game-specific components
│   └── forms/     # Form components
├── lib/
│   ├── types.ts   # TypeScript types
│   └── utils.ts   # Utility functions
└── data/
    └── contracts.json  # Local storage for contracts
```