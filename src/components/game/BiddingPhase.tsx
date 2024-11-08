import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { Player, Contract } from '@/lib/types'

export function BiddingPhase({
  contract,
  players,
  onBidComplete
}: {
  contract: Contract
  players: Player[]
  onBidComplete: (contract: Contract) => void
}) {
  const [currentBid, setCurrentBid] = useState(contract.minimumBid)
  const [highestBidder, setHighestBidder] = useState<Player | null>(null)
  const [biddingComplete, setBiddingComplete] = useState(false)

  const handleBid = (player: Player, amount: number) => {
    if (amount > (highestBidder ? currentBid : contract.minimumBid) && player.credits >= amount) {
      setCurrentBid(amount)
      setHighestBidder(player)
    }
  }

  const completeBidding = () => {
    if (!highestBidder) return

    // Update contract status
    const updatedContract: Contract = {
      ...contract,
      status: 'sold',
      winner: highestBidder.id,
      winningBid: currentBid
    }

    // Calculate profit/loss
    const profit = updatedContract.trueValue - currentBid
    const isWin = profit > 0

    setBiddingComplete(true)
    
    setTimeout(() => {
      onBidComplete(updatedContract)
    }, 5000) // Show results for 5 seconds
  }

  if (biddingComplete) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Bidding Results</h3>
        <div className="space-y-4">
          <p>Contract: {contract.title}</p>
          <p>Winner: {highestBidder?.name}</p>
          <p>Winning Bid: {currentBid} credits</p>
          <p>True Value: {contract.trueValue} credits</p>
          <p className={`text-xl font-bold ${contract.trueValue > currentBid ? 'text-green-500' : 'text-red-500'}`}>
            {contract.trueValue > currentBid ? 'WIN!' : 'LOSS!'}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-4">Current Auction</h3>
        <div className="space-y-4">
          <p>Contract: {contract.title}</p>
          <p>Current Bid: {currentBid} credits</p>
          <p>Highest Bidder: {highestBidder?.name || 'None'}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {players.map(player => (
          <Card key={player.id} className="p-4">
            <h4 className="font-bold mb-2">{player.name}</h4>
            <p>Available Credits: {player.credits}</p>
            <div className="flex space-x-2 mt-4">
              <Input
                type="number"
                min={currentBid + 100}
                max={player.credits}
                step={100}
                placeholder="Enter bid amount"
                onChange={(e) => handleBid(player, parseInt(e.target.value))}
              />
              <Button
                onClick={() => handleBid(player, currentBid + 100)}
                disabled={player.credits < currentBid + 100}
              >
                Bid
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button 
        className="w-full"
        onClick={completeBidding}
        disabled={!highestBidder}
      >
        Complete Bidding
      </Button>
    </div>
  )
}