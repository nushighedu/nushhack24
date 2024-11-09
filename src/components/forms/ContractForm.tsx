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
  const [requirementsInput, setRequirementsInput] = useState(contract.requirements?.join(', ') || '');

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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          required
          placeholder="Describe the project scope and guidelines..."
          value={contract.description || ''}
          onChange={(e) => setContract({ ...contract, description: e.target.value })}
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Requirements (comma-separated)</label>
        <Input
          placeholder="e.g., ISO certification, Local workforce, Green certification"
          value={requirementsInput}
          onChange={(e) => {
            setRequirementsInput(e.target.value);
            // Update the actual requirements array only after typing
            setContract({
              ...contract,
              requirements: e.target.value
                .split(',')
                .map(r => r.trim())
                .filter(Boolean)
            });
          }}
          onBlur={() => {
            // Clean up the input on blur
            const cleanedRequirements = requirementsInput
              .split(',')
              .map(r => r.trim())
              .filter(Boolean);
            setRequirementsInput(cleanedRequirements.join(', '));
          }}
        />
        {/* Shows requirements as tags below the input */}
        <div className="mt-2 flex flex-wrap gap-2">
          {contract.requirements?.map((req, index) => (
            <div
              key={index}
              className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-sm"
            >
              {req}
            </div>
          ))}
        </div>
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
          Bid Duration (minutes): {contract.bidDuration || 5}
        </label>
        <div className="relative">
          <Slider
              type="number"
              required
              min={1}
              max={30}
              step={1}
              value={[contract.bidDuration || 5]}
              onValueChange={([value]) => setContract({
                ...contract,
                bidDuration: value
              })}
              className="w-full relative flex items-center select-none touch-none h-5"
          />
        </div>

        <label className="block text-sm font-medium mb-1">
          Sustainability Score (1-10): {contract.sustainability}
        </label>
        <div className="relative">
          <Slider
              min={1}
              max={10}
              step={1}
              value={[contract.sustainability || 5]}
              onValueChange={([value]) => setContract({
                ...contract,
                sustainability: value
              })}
              className="w-full relative flex items-center select-none touch-none h-5"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
        )}
        <Button
            className='text-white dark:text-gray-700'
            type="submit"
            disabled={!isFormValid()}
        >
          Create Contract
        </Button>
      </div>
    </form>
  );
}