import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CompanyForm } from '../forms/CompanyForm'
import type { Player } from '@/lib/types'

export function GameLobby({ 
  onStart 
}: { 
  onStart: (players: Player[]) => void 
}) {
  const [players, setPlayers] = useState<Player[]>([])
  const [currentForm, setCurrentForm] = useState<'addPlayer' | 'setupCompany'>('addPlayer')
  const [tempPlayer, setTempPlayer] = useState<Partial<Player>>({})

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      credits: 3000,
      company: {
        name: '',
        description: '',
        expertise: [],
        yearsOfExperience: 0,
        previousProjects: []
      }
    }
    setTempPlayer(newPlayer)
    setCurrentForm('setupCompany')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Game Lobby</h2>
        
        {currentForm === 'addPlayer' && (
          <div className="space-y-4">
            <Input
              placeholder="Enter player name"
              onChange={(e) => setTempPlayer({ ...tempPlayer, name: e.target.value })}
            />
            <Button 
              onClick={() => handleAddPlayer(tempPlayer.name || '')}
              disabled={!tempPlayer.name}
            >
              Add Player
            </Button>
          </div>
        )}

        {currentForm === 'setupCompany' && (
          <CompanyForm
            onSubmit={(company) => {
              setPlayers([...players, { ...tempPlayer, company } as Player])
              setCurrentForm('addPlayer')
              setTempPlayer({})
            }}
          />
        )}

        <div className="mt-8">
          <h3 className="text-xl mb-4">Players ({players.length}/4)</h3>
          {players.map(player => (
            <div key={player.id} className="bg-gray-700 p-4 rounded mb-2">
              {player.name} - {player.company.name}
            </div>
          ))}
        </div>

        <Button
          className="mt-4"
          disabled={players.length < 2}
          onClick={() => onStart(players)}
        >
          Start Game
        </Button>
      </div>
    </div>
  )
}