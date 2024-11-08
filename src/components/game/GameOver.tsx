import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Player } from '@/lib/types'

export function GameOver({
  players,
  onPlayAgain
}: {
  players: Player[]
  onPlayAgain: () => void
}) {
  // Sort players by final credits
  const sortedPlayers = [...players].sort((a, b) => b.credits - a.credits)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Game Over!</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Final Standings</h3>
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`p-4 rounded-lg ${index === 0 ? 'bg-yellow-500/20' : 'bg-gray-700'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">{index + 1}. {player.name}</span>
                  <p className="text-sm text-gray-300">{player.company.name}</p>
                </div>
                <span className="text-xl font-bold">{player.credits} credits</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full mt-8"
          onClick={onPlayAgain}
        >
          Play Again
        </Button>
      </Card>
    </div>
  )
}
