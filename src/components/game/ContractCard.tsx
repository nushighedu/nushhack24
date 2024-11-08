import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Timer, DollarSign, Award } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Contract } from '@/lib/types';

interface ContractCardProps {
  contract: Contract;
  currentUser: User;
  onBid: (contractId: string, amount: number) => void;
}

export function ContractCard({ contract, currentUser, onBid }: ContractCardProps) {
  const [bidAmount, setBidAmount] = useState<number>(0);

  const getTimeRemaining = (expirationTime: string) => {
    const remaining = new Date(expirationTime).getTime() - Date.now();
    if (remaining <= 0) return 'Expired';

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentBid = () => {
    const bids = Object.values(contract.bids);
    return bids.length > 0
      ? Math.max(...bids.map(b => b.amount))
      : contract.minimumBid;
  };

  const isCompleted = contract.status === 'completed';
  const isExpired = contract.status === 'expired';
  const currentBid = getCurrentBid();

  return (
    <Card className={`
      w-full bg-gray-900/50 border-gray-800
      ${isCompleted ? 'opacity-75' : ''}
      ${isExpired ? 'opacity-50' : ''}
      ${contract.bids[currentUser.username] ? 'ring-1 ring-blue-500/50' : ''}
    `}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{contract.title}</CardTitle>
          {contract.status === 'active' && (
            <div className={`
              px-2 py-1 rounded text-sm font-medium flex items-center
              ${getTimeRemaining(contract.expirationTime) === 'Expired'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-blue-500/20 text-blue-400'}
            `}>
              <Timer className="w-4 h-4 mr-1" />
              {getTimeRemaining(contract.expirationTime)}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Collapsible>
          <CollapsibleTrigger className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors">
            <ChevronDown className="w-4 h-4 mr-1" />
            Contract Details
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 text-sm">
            <p>{contract.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-gray-400">Minimum Bid</p>
                <p className="font-medium">{contract.minimumBid} credits</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400">Duration</p>
                <p className="font-medium">{contract.expectedDuration} months</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Bid Section */}
        <div className="pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Current Bid</span>
            <span className="font-medium">{currentBid} credits</span>
          </div>

          {contract.status === 'active' && (
            <div className="flex gap-2">
              <Input
                type="number"
                min={currentBid + 100}
                step={100}
                value={bidAmount || ''}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="bg-gray-800"
                placeholder={`Min: ${currentBid + 100}`}
              />
              <Button
                onClick={() => onBid(contract.id, bidAmount)}
                disabled={!bidAmount || bidAmount <= currentBid}
                className="shrink-0"
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Place Bid
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-500/10 rounded-lg p-3 mt-2">
              <div className="flex items-center text-green-400 mb-1">
                <Award className="w-4 h-4 mr-1" />
                <span className="font-medium">Winner: {contract.winner}</span>
              </div>
              <p className="text-sm">
                Winning Bid: {contract.winningBid} credits
              </p>
              {contract.winner === currentUser.username && (
                <p className="text-sm text-green-400 mt-1">
                  Profit: {contract.trueValue - contract.winningBid!} credits
                </p>
              )}
            </div>
          )}

          {isExpired && (
            <div className="bg-red-500/10 text-red-400 rounded-lg p-3 mt-2 text-sm">
              Contract expired with no valid bids
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
