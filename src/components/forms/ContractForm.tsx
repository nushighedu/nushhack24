import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import type { Player, Contract } from '@/lib/types'

export function ContractForm({
    player,
    onSubmit
  }: {
    player: Player
    onSubmit: (contract: Omit<Contract, 'id' | 'status' | 'trueValue'>) => void
  }) {
    const [contract, setContract] = useState<Partial<Contract>>({
      createdBy: player.id,
      requirements: []
    })
  
    // Singapore-themed project suggestions
    const projectSuggestions = [
      "MRT Line Extension Project",
      "Smart Nation Infrastructure Development",
      "Sustainable Housing Complex",
      "Green Corridor Enhancement",
      "Digital Healthcare Hub Construction",
      "Port Automation System Implementation",
    ]
  
    return (
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(contract as Contract)
        }}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Contract Title</label>
          <Input
            required
            placeholder="e.g., North-South Line Extension"
            value={contract.title || ''}
            onChange={(e) => setContract({ ...contract, title: e.target.value })}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {projectSuggestions.map(suggestion => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContract({ ...contract, title: suggestion })}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            required
            placeholder="Describe the project scope and objectives..."
            value={contract.description || ''}
            onChange={(e) => setContract({ ...contract, description: e.target.value })}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Requirements (comma-separated)</label>
          <Input
            placeholder="e.g., ISO certification, Local workforce, Green certification"
            value={contract.requirements?.join(', ') || ''}
            onChange={(e) => setContract({ 
              ...contract, 
              requirements: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
            })}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Expected Duration (months)</label>
          <Input
            type="number"
            required
            min={1}
            max={60}
            value={contract.expectedDuration || ''}
            onChange={(e) => setContract({ 
              ...contract, 
              expectedDuration: parseInt(e.target.value) 
            })}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">
            Sustainability Score (1-10)
          </label>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[contract.sustainability || 5]}
            onValueChange={([value]) => setContract({ 
              ...contract, 
              sustainability: value 
            })}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Minimum Bid (credits)</label>
          <Input
            type="number"
            required
            min={500}
            max={5000}
            step={100}
            value={contract.minimumBid || ''}
            onChange={(e) => setContract({ 
              ...contract, 
              minimumBid: parseInt(e.target.value) 
            })}
          />
        </div>
  
        <Button type="submit" className="w-full">
          Submit Contract
        </Button>
      </form>
    )
  }