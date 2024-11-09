import {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, BrainCircuit, ChevronDown, DollarSign, Loader2, Timer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Contract, OpenAIResponse, User } from '@/lib/types';
import { sleep } from "openai/core";
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getOpenAIResponse } from "@/lib/openai";
import {LocalStore} from "@/lib/store";

interface ContractCardProps {
  contract: Contract;
  currentUser: User;
  onBid: (contractId: string, amount: number) => void;
  refresh?: () => void;
}

export function ContractCard({ contract, currentUser, onBid, refresh }: ContractCardProps) {
  const [loading, setLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [aiResponse, setAiResponse] = useState<OpenAIResponse | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);

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

  const handleAnalysis = async () => {
    if (!aiResponse || !aiResponse.analysis) {
      setLoading(true);

      if (contract?.AI_info?.analysis) {
        await sleep(Math.random() * 1000 + 500);
        setAiResponse(contract?.AI_info);
      }
      else {
        // get analysis now
        const response = await getOpenAIResponse(contract);
        setAiResponse(response);

        // update contract with AI info
        const newContract = { ...contract, AI_info: response, trueValue: response.value };
        LocalStore.updateContract(newContract.id, newContract as Contract);
        if (refresh) refresh();
      }

      setLoading(false);
    }
  };

  const isCompleted = contract.status === 'completed';
  const isExpired = contract.status === 'expired';
  const currentBid = getCurrentBid();

  const [profit, setProfit] = useState<number>(0);
  useEffect(() => {
    setProfit(contract.trueValue - contract.winningBid!);
  }, [contract.trueValue, contract.winningBid]);

  return (
    <Card className={`
      w-full 
      bg-white dark:bg-gray-950/50 
      border-gray-800 dark:border-gray-900
      ${isCompleted ? 'opacity-75' : ''}
      ${isExpired ? 'opacity-50' : ''}
      ${contract.bids[currentUser.username] ? 'ring-1 ring-blue-500/50' : ''}
    `}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {contract.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* AI Analysis Button */}
            <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
                  onClick={handleAnalysis}
                >
                  <BrainCircuit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-800/80 text-white max-h-[80vh] overflow-y-auto">
                <DialogHeader className="sticky top-0 bg-gray-800/80 py-4 backdrop-blur-sm">
                  <DialogTitle>AI Analysis: {contract?.title}</DialogTitle>
                </DialogHeader>

                <div className="px-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="ml-2">Analyzing contract...</span>
                    </div>
                  ) : aiResponse ? (
                    <div className="space-y-6 pb-6">
                      {contract.status !== 'active' && (
                      <div>
                        <div className="p-4 rounded-lg bg-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span>Estimated True Value:</span>
                            <span className="font-bold">{aiResponse.value} credits</span>
                          </div>
                          <p className="text-sm text-gray-400">{aiResponse.reasoning}</p>
                        </div>
                      </div>
                      )}

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Detailed Analysis</h3>
                        <MarkdownRenderer content={aiResponse.analysis} className="prose prose-invert max-w-none" />
                      </div>

                      {currentUser?.userType === 'government' && (
                        <div className="bg-green-500/10 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Bidding Recommendation</h4>
                          <p className="text-sm">
                            {aiResponse.value > contract.minimumBid * 2.5
                            ? "This contract appears to be undervalued!"
                            : aiResponse.value < contract.minimumBid * 1.5
                                  ? "Exercise caution when bidding..."
                                  : "The contract value seems reasonable..."}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      Failed to load analysis. Please try again.
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Timer */}
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
        </div>
      </CardHeader>

      <CardContent className="text-gray-700 dark:text-gray-300">
        <Collapsible>
          <CollapsibleTrigger className="flex items-center text-sm text-black hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
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
            <span className="text-black dark:text-gray-400">Current Bid</span>
            <span className="font-medium">{currentBid} credits</span>
          </div>

          {contract.status === 'active' && currentUser?.userType === 'government' && (
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
              <div className={`${profit > 0 ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-lg p-3 mt-2`}>
                <div className={`flex items-center ${profit > 0 ? 'text-green-400' : 'text-red-400'} mb-1`}>
                  <Award className="w-4 h-4 mr-1"/>
                  <span className="font-medium">Winner: {contract.winner}</span>
                </div>
                <p className="text-sm">
                  Winning Bid: {contract.winningBid} credits
                </p>
                {contract.winner === currentUser.username && (
                    <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'} mt-1`}>
                      {profit > 0 ? `Profit: ${profit} credits` : `Loss: ${-profit} credits`}
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