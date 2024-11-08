import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { User, Contract, Bid } from '@/lib/types';

type SortOption = 'expiringSoon' | 'highestBid' | 'mostBids' | 'newest';
type FilterOption = 'all' | 'active' | 'completed' | 'expired';

export function ContractList({
    contracts,
    currentUser,
    onBid
}: {
    contracts: Contract[];
    currentUser: User;
    onBid: (contractId: string, amount: number) => void;
}) {
    const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});

    const getTimeRemaining = (expirationTime: string) => {
        const remaining = new Date(expirationTime).getTime() - Date.now();
        if (remaining <= 0) return 'Expired';

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getTimeRemainingMs = (expirationTime: string) => {
        return new Date(expirationTime).getTime() - Date.now();
    };

    const getHighestBid = (contract: Contract) => {
        const bids = Object.values(contract.bids);
        return bids.length > 0
            ? Math.max(...bids.map(b => b.amount))
            : contract.minimumBid;
    };

    const getBidHistory = (bids: Record<string, Bid>) => {
        return Object.values(bids)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    const calculateBidProgress = (contract: Contract) => {
        const highestBid = getHighestBid(contract);
        const maxExpectedBid = contract.minimumBid * 2; // Assume 2x minimum as "full" progress
        return Math.min((highestBid / maxExpectedBid) * 100, 100);
    };

    return (
        <div className="space-y-6">
            {/* Filters and Controls */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    placeholder="Search contracts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:col-span-2"
                />
                <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                >
                    <option value="expiringSoon">Expiring Soon</option>
                    <option value="highestBid">Highest Bid</option>
                    <option value="mostBids">Most Bids</option>
                    <option value="newest">Newest</option>
                </Select>
                <Select
                    value={filterStatus}
                    onValueChange={(value) => setFilterStatus(value as FilterOption)}
                >
                    <option value="all">All Contracts</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                </Select>
            </div> */}

            {/* Contracts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(contracts) && contracts.map(contract => (
                    <Card
                        key={contract.id}
                        className={`
              transition-all duration-200
              ${contract.status === 'completed' ? 'opacity-75' : ''}
              ${contract.status === 'expired' ? 'opacity-50' : ''}
              ${contract.bids[currentUser.username] ? 'ring-2 ring-blue-500' : ''}
            `}
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{contract.title}</span>
                                {contract.status === 'active' && (
                                    <span className={`
                    text-sm font-normal px-2 py-1 rounded
                    ${getTimeRemainingMs(contract.expirationTime) < 300000 ? 'bg-red-500/20' : 'bg-blue-500/20'}
                  `}>
                                        {getTimeRemaining(contract.expirationTime)}
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="details">
                                    <AccordionTrigger>Contract Details</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2 text-sm">
                                            <p>{contract.description}</p>
                                            <div className="mt-4">
                                                <p>Requirements:</p>
                                                <ul className="list-disc list-inside">
                                                    {contract.requirements.map((req, index) => (
                                                        <li key={index}>{req}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <div>
                                                    <p className="text-gray-400">Duration</p>
                                                    <p>{contract.expectedDuration} months</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Sustainability</p>
                                                    <p>{contract.sustainability}/10</p>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="bids">
                                    <AccordionTrigger>Bid History</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            {getBidHistory(contract.bids).map(bid => (
                                                <div
                                                    key={bid.timestamp}
                                                    className={`
                            flex justify-between items-center p-2 rounded
                            ${bid.userId === currentUser.username ? 'bg-blue-500/20' : 'bg-gray-800'}
                          `}
                                                >
                                                    <span>{bid.userId}</span>
                                                    <span>{bid.amount} credits</span>
                                                </div>
                                            ))}
                                            {Object.keys(contract.bids).length === 0 && (
                                                <p className="text-center text-gray-400">No bids yet</p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Current Bid</span>
                                        <span>{getHighestBid(contract)} credits</span>
                                    </div>
                                    <Progress value={calculateBidProgress(contract)} />
                                </div>

                                {contract.status === 'active' && (
                                    <div className="flex space-x-2">
                                        <Input
                                            type="number"
                                            min={getHighestBid(contract) + 100}
                                            max={currentUser.credits}
                                            step={100}
                                            placeholder="Enter bid amount"
                                            value={bidAmounts[contract.id] || ''}
                                            onChange={(e) => setBidAmounts({
                                                ...bidAmounts,
                                                [contract.id]: parseInt(e.target.value)
                                            })}
                                        />
                                        <Button
                                            onClick={() => {
                                                const amount = bidAmounts[contract.id];
                                                if (amount) {
                                                    onBid(contract.id, amount);
                                                    setBidAmounts({
                                                        ...bidAmounts,
                                                        [contract.id]: 0
                                                    });
                                                }
                                            }}
                                            disabled={
                                                !bidAmounts[contract.id] ||
                                                bidAmounts[contract.id] <= getHighestBid(contract) ||
                                                bidAmounts[contract.id] > currentUser.credits
                                            }
                                        >
                                            Place Bid
                                        </Button>
                                    </div>
                                )}

                                {contract.status === 'completed' && (
                                    <div className="bg-green-500/20 p-3 rounded">
                                        <p className="font-bold">Winner: {contract.winner}</p>
                                        <p>Winning Bid: {contract.winningBid} credits</p>
                                        {contract.winner === currentUser.username && (
                                            <p className="text-green-400 mt-2">
                                                Profit: {contract.trueValue - contract.winningBid!} credits
                                            </p>
                                        )}
                                    </div>
                                )}

                                {contract.status === 'expired' && (
                                    <div className="bg-red-500/20 p-3 rounded">
                                        <p>Contract expired with no valid bids</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {contracts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>No contracts found matching your criteria</p>
                </div>
            )}
        </div>
    );
}