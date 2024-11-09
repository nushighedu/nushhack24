# Contract Nexus

An online platform to easily create and bid for system modernisation contracts. Be a Business or a Government Agency -
the possibilities are endless!

## Team Members

Jiang Muzhen, Ahmad Dzuizz Annajib, Tyler Kiong Tai Le

from NUS High School

https://devpost.com/software/contract-nexus

## Overview

Contract Nexus is a gamified platform where you can create and bid for contracts regarding system modernisation. To
start as a Business, simply browse our directory of government agencies to learn about the different systems you can
attempt to modernise. Then, create a contract. To start as a Government Agency, browse the different contracts
available - and bid for one! You can also view detailed AI analysis on the contract to help you choose. Once the bid is
complete, the true value of the contract is revealed!

## Getting Started

Pre-requisites: Node.js 14 or later, npm, OpenAI API Key

1. Clone the repository
2. Install dependencies:

```bash
npm install --force
```

3. To access AI features, you will need to obtain an OpenAI API Key and set it as the environment
   variable `NEXT_PUBLIC_OPENAI_API_KEY`:

```bash
export NEXT_PUBLIC_OPENAI_API_KEY=your-api-key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to start!

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- TailwindCSS
- ESLint
- Shadcn/UI Components

## Work Distribution

- Jiang Muzhen: Product management, UX, Backend, AI Integration
- Ahmad Dzuizz Annajib: Product design, Frontend, UI/UX, Backend
- Tyler Kiong Tai Le: Visual design, Product innovation, Product presentation