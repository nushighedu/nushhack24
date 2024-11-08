import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import type { User, Contract } from '@/lib/types';

interface ContractFormProps {
  user: User;
  onSubmit: (contract: Omit<Contract, 'id' | 'status' | 'trueValue'>) => void;
  onCancel?: () => void;
}

export function ContractForm({ user, onSubmit, onCancel }: ContractFormProps) {
  const [contract, setContract] = useState<Partial<Omit<Contract, 'id' | 'status' | 'trueValue'>>>({
    createdBy: user.username, // Use username instead of id
    requirements: [],
    sustainability: 5,
    expectedDuration: 12,
    minimumBid: 1000,
    bids: {}
  });

  // Predefined Singapore-themed project suggestions
  const projectSuggestions = [
    "MRT Thomson-East Coast Line Extension",
    "Changi Airport Terminal 5 Development",
    "Tuas Port Automation System",
    "Smart Nation Sensor Platform",
    "Jurong Lake District Development",
    "Greater Southern Waterfront Project"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(contract as Required<typeof contract>);
    }
  };

  const isFormValid = () => {
    return contract.title &&
           contract.description &&
           contract.minimumBid &&
           contract.expectedDuration &&
           contract.sustainability;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Contract Title</label>
        <Input
          required
          placeholder="e.g., MRT Line Extension"
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
          className="h-32"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Sustainability Score (1-10): {contract.sustainability}
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
          className="my-4"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          disabled={!isFormValid()}
        >
          Create Contract
        </Button>
      </div>
    </form>
  );
}