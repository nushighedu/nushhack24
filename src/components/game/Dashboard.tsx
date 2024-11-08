import { useState, useEffect, useMemo } from 'react';
import { Award, FileText, LogOut, Percent, Plus, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractForm } from '@/components/forms/ContractForm';
import { ContractList } from '@/components/game/ContractList';
import { UserStats } from '@/components/game/UserStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { User, Contract, OpenAIResponse } from '@/lib/types';
import { LocalStore } from '@/lib/store';
import { AgencySearch } from '@/components/search/agencySearch';
import { getOpenAIResponse } from "@/lib/openai";
import { ThemeToggle } from '../theme-toggle';

type SortOption = 'expiringSoon' | 'highestBid' | 'mostBids' | 'newest';
type FilterOption = 'all' | 'active' | 'completed' | 'expired';

export function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
    const [contracts, setContracts] = useState<Record<string, Contract>>({});
    const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
    const [showCreateContract, setShowCreateContract] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('expiringSoon');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadContracts();
        const interval = setInterval(checkExpirations, 1000);
        return () => clearInterval(interval);
    }, []);

    const loadContracts = () => {
        setContracts(LocalStore.getContracts());
    };

    const getHighestBid = (contract: Contract) => {
        const bids = Object.values(contract.bids);
        return bids.length > 0
            ? Math.max(...bids.map(b => b.amount))
            : contract.minimumBid;
    };

    const checkExpirations = () => {
        const currentContracts = LocalStore.getContracts();
        let updated = false;

        Object.entries(currentContracts).forEach(([id, contract]) => {
            if (contract.status === 'active' && new Date(contract.expirationTime) <= new Date()) {
                const highestBid = Object.values(contract.bids).sort((a, b) => b.amount - a.amount)[0];

                if (highestBid) {
                    contract.status = 'completed';
                    contract.winner = highestBid.userId;
                    contract.winningBid = highestBid.amount;

                    const winner = LocalStore.getUser(highestBid.userId);
                    if (winner) {
                        winner.credits -= highestBid.amount;

                        if (!winner.contractsWon) {
                            winner.contractsWon = [];
                        }
                        winner.contractsWon.push(contract.id);
                        LocalStore.setUser(winner.username, winner);
                    }
                } else {
                    contract.status = 'expired';
                }

                currentContracts[id] = contract;
                updated = true;
            }
        });

        if (updated) {
            LocalStore.setContracts(currentContracts);
            loadContracts();
        }
    };

    const handleCreateContract = async (contract: Partial<Contract>) => {
        let newContract: Partial<Contract> = {
            ...contract,
            id: crypto.randomUUID(),
            status: 'active',
            AI_info: { analysis: '', reasoning: '', value: 0 },
            trueValue: 0,
            expirationTime: new Date(Date.now() + 5 * 60000).toISOString(),
            bids: {},
            createdByBusiness: user.username,
            sustainabilityRating: undefined,
            completionStatus: undefined,
            governmentRating: undefined,
            contractorRating: undefined
        };

        // Update business stats
        if (user.userType === 'business') {
            const updatedUser = {
                ...user,
                stats: {
                    ...user.stats,
                    contractsCreated: user.stats.contractsCreated + 1,
                    activeContracts: [...user.stats.activeContracts.filter(Boolean), newContract.id]
                }
            };
            LocalStore.setUser(user.username, updatedUser);
        }

        LocalStore.addContract(newContract);
        loadContracts();

        setShowCreateContract(false); // hide the form

        // call OpenAI to get contract analysis
        const aiResponse = await getOpenAIResponse(contract);

        newContract = {
            ...newContract,
            AI_info: aiResponse,
            trueValue: aiResponse.value,
        };

        LocalStore.updateContract(newContract.id, newContract as Contract);
        loadContracts();
    };

    const handleBid = (contractId: string, amount: number) => {
        const contract = contracts[contractId];
        if (!contract || contract.status !== 'active') return;

        const bid = {
            userId: user.username,
            amount,
            timestamp: new Date().toISOString()
        };

        contract.bids[user.username] = bid;
        LocalStore.updateContract(contractId, contract);
        loadContracts();
    };

    const filteredAndSortedContracts = useMemo(() => {
        let filtered = Object.values(contracts);

        if (searchQuery) {
            filtered = filtered.filter(contract =>
                contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contract.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(contract => contract.status === filterStatus);
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'expiringSoon':
                    return new Date(a.expirationTime).getTime() - new Date(b.expirationTime).getTime();
                case 'highestBid':
                    return getHighestBid(b) - getHighestBid(a);
                case 'mostBids':
                    return Object.keys(b.bids).length - Object.keys(a.bids).length;
                case 'newest':
                    return new Date(b.expirationTime).getTime() - new Date(a.expirationTime).getTime();
                default:
                    return 0;
            }
        });
    }, [contracts, searchQuery, sortBy, filterStatus]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            <div className="flex justify-between items-center bg-inherit dark:bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Contract Nexus
                    </h1>
                    <p className="text-gray-400 mt-1">Singapore&apos;s Infrastructure Bidding Platform</p>
                </div>
                <div>
                    <ThemeToggle />
                    <Button
                        onClick={onLogout}
                        variant="ghost"
                        className="pl-8 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <UserStats user={user} />

                    {user.userType === 'business' && (
                        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Contract
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => setShowCreateContract(true)}
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                >
                                    New Contract
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-white dark:bg-gray-800/50 border-0">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            {user.userType === 'business' ? (
                                <>
                                    <QuickStat
                                        icon={<FileText className="w-4 h-4" />}
                                        label="Active Contracts"
                                        value={user.stats.activeContracts.length}
                                    />
                                    <QuickStat
                                        icon={<TrendingUp className="w-4 h-4" />}
                                        label="Completion Rate"
                                        value={`${Math.round(user.stats.contractCompletionRate)}%`}
                                    />
                                </>
                            ) : (
                                <>
                                    <QuickStat
                                        icon={<Award className="w-4 h-4" />}
                                        label="Total Contracts"
                                        value={`${user.stats.contractsTotal}/100`}
                                    />
                                    <QuickStat
                                        icon={<Percent className="w-4 h-4" />}
                                        label="Win Rate"
                                        value={`${Math.round(user.stats.winRate)}%`}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {showCreateContract ? (
                        <Card className="p-6">
                            <CardHeader>
                                <CardTitle className='flex justify-between'>
                                    <span>Create New Contract</span>
                                    <span className='text-red-400'>Remember! "Modernise an existing system/process, making it secure and future-ready"</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ContractForm
                                    user={user}
                                    onSubmit={handleCreateContract}
                                    onCancel={() => setShowCreateContract(false)}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <Input
                                    placeholder="Search contracts..."
                                    className="pl-10 bg-white dark:bg-gray-800/50 border-0"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {/* <Select
                                value={sortBy}
                                onValueChange={(value) => setSortBy(value as SortOption)}
                            >
                                <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-0">
                                    <SelectValue placeholder="Sort by..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
                                    <SelectItem value="highestBid">Highest Bid</SelectItem>
                                    <SelectItem value="mostBids">Most Bids</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterStatus}
                                onValueChange={(value) => setFilterStatus(value as FilterOption)}
                            >
                                <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-0">
                                    <SelectValue placeholder="Filter by status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Contracts</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select> */}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <AgencySearch />
                    </div>

                    <ContractList
                        contracts={filteredAndSortedContracts}
                        currentUser={user}
                        onBid={handleBid}
                    />
                </div>
            </div>
        </div>
    );
}

function QuickStat({
    icon,
    label,
    value
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number
}) {
    return (
        <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
                {icon}
                <span className="text-xs ml-1">{label}</span>
            </div>
            <p className="text-lg font-bold">{value}</p>
        </div>
    );
}