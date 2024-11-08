'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GameLobby } from '@/components/game/GameLobby'
import { GameBoard } from '@/components/game/GameBoard'
import { GameOver } from '@/components/game/GameOver'

export default function Home() {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'over'>('lobby')
  const [players, setPlayers] = useState<Player[]>([])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Strategic Auction Simulator
      </h1>
      
      {gameState === 'lobby' && (
        <GameLobby 
          onStart={(players) => {
            setPlayers(players)
            setGameState('playing')
          }}
        />
      )}
      
      {gameState === 'playing' && (
        <GameBoard 
          players={players}
          onGameOver={() => setGameState('over')}
        />
      )}
      
      {gameState === 'over' && (
        <GameOver 
          players={players}
          onPlayAgain={() => {
            setPlayers([])
            setGameState('lobby')
          }}
        />
      )}
    </main>
  )
}