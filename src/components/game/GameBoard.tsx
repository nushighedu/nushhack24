import { useState, useEffect } from 'react'
import { ContractForm } from '@/components/forms/ContractForm'
import { ContractCard } from '@/components/game/ContractCard'
import { BiddingPhase } from '@/components/game/BiddingPhase'
import type { Player, Contract } from '@/lib/types'
import { Button } from '../ui/button'

export function GameBoard({
  players,
  onGameOver
}: {
  players: Player[]
  onGameOver: () => void
}) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [phase, setPhase] = useState<'creation' | 'bidding'>('creation')
  const [currentContract, setCurrentContract] = useState<Contract | null>(null)

  useEffect(() => {
    if (phase === 'bidding' && contracts.every(c => c.status === 'sold')) {
      onGameOver()
    }
  }, [contracts, phase])

  return (
    <div className="max-w-4xl mx-auto">
      {phase === 'creation' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Contract Creation Phase</h2>
          {players.map(player => (
            <div key={player.id} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl mb-4">{player.name}'s Turn</h3>
              <ContractForm
                player={player}
                onSubmit={(contract) => {
                  setContracts([...contracts, {
                    ...contract,
                    id: crypto.randomUUID(),
                    status: 'pending',
                    trueValue: Math.floor(Math.random() * 5000) + 1000 // Simplified value generation
                  }])
                }}
              />
            </div>
          ))}
          <Button
            disabled={contracts.length < players.length}
            onClick={() => setPhase('bidding')}
          >
            Start Bidding Phase
          </Button>
        </div>
      )}

      {phase === 'bidding' && currentContract && (
        <BiddingPhase
          contract={currentContract}
          players={players}
          onBidComplete={(updatedContract) => {
            setContracts(contracts.map(c => 
              c.id === updatedContract.id ? updatedContract : c
            ))
            setCurrentContract(null)
          }}
        />
      )}

      {phase === 'bidding' && !currentContract && (
        <div className="grid grid-cols-2 gap-4">
          {contracts
            .filter(c => c.status === 'pending')
            .map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onClick={() => setCurrentContract(contract)}
              />
            ))}
        </div>
      )}
    </div>
  )
}