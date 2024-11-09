import { useMemo } from 'react';
import { ContractCard } from './ContractCard';
import type { User, Contract } from '@/lib/types';

interface ContractListProps {
    contracts: Contract[];
    currentUser: User;
    onBid: (contractId: string, amount: number) => void;
    sortBy?: 'expiringSoon' | 'highestBid' | 'mostBids' | 'newest';
    refresh?: () => void;
}

export function ContractList({
    contracts,
    currentUser,
    onBid,
    sortBy = 'expiringSoon',
    refresh,
}: ContractListProps) {
    const sortedContracts = useMemo(() => {
        if (!Array.isArray(contracts)) return [];

        return [...contracts].sort((a, b) => {
            switch (sortBy) {
                case 'expiringSoon':
                    return new Date(a.expirationTime).getTime() - new Date(b.expirationTime).getTime();
                case 'highestBid':
                    const getHighestBid = (c: Contract) =>
                        Math.max(
                            ...Object.values(c.bids).map(bid => bid.amount),
                            c.minimumBid
                        );
                    return getHighestBid(b) - getHighestBid(a);
                case 'mostBids':
                    return Object.keys(b.bids).length - Object.keys(a.bids).length;
                case 'newest':
                    return new Date(b.expirationTime).getTime() - new Date(a.expirationTime).getTime();
                default:
                    return 0;
            }
        });
    }, [contracts, sortBy]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedContracts.map(contract => (
                    <ContractCard
                        key={contract.id}
                        contract={contract}
                        currentUser={currentUser}
                        onBid={onBid}
                        refresh={refresh}
                    />
                ))}
            </div>

            {sortedContracts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>No contracts found matching your criteria</p>
                </div>
            )}
        </div>
    );
}