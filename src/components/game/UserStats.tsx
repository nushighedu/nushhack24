import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LocalStore } from '@/lib/store';
import type { User, GovernmentUser, BusinessUser } from '@/lib/types';

export function UserStats({ user }: { user: User }) {
    const contracts = LocalStore.getContracts();

    if (user.userType === 'government') {
        return <GovernmentStats user={user} contracts={contracts} />;
    }

    return <BusinessStats user={user} contracts={contracts} />;
}

function GovernmentStats({ user, contracts }: { user: GovernmentUser, contracts: Record<string, Contract> }) {
    const userContracts = Object.values(contracts).filter(c =>
        user.stats.activeContracts.includes(c.id) ||
        user.stats.completedContracts.includes(c.id)
    );

    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <div className="grid gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{user.company.name}</h3>
                            <p className="text-sm text-gray-400">Government Agency</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-lg">{user.credits}</h3>
                            <p className="text-sm text-gray-400">Available Credits</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Reputation</span>
                                <span>{user.stats.reputation}/100</span>
                            </div>
                            <Progress value={user.stats.reputation} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <StatItem
                                label="Contracts Won"
                                value={user.stats.contractsWon}
                            />
                            <StatItem
                                label="Success Rate"
                                value={`${Math.round(user.stats.successRate)}%`}
                            />
                            <StatItem
                                label="Total Profit"
                                value={`${user.stats.totalProfit} credits`}
                            />
                            <StatItem
                                label="Active Contracts"
                                value={user.stats.activeContracts.length}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BusinessStats({ user, contracts }: { user: BusinessUser, contracts: Record<string, Contract> }) {
    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <div className="grid gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{user.organization.name}</h3>
                            <p className="text-sm text-gray-400">Business/Organization</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-lg">{user.credits}</h3>
                            <p className="text-sm text-gray-400">Budget Available</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Sustainability Goal Progress</span>
                                <span>{Math.round(user.stats.averageSustainability)}/{user.organization.sustainabilityGoal}</span>
                            </div>
                            <Progress
                                value={(user.stats.averageSustainability / user.organization.sustainabilityGoal) * 100}
                                className="h-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <StatItem
                                label="Contracts Created"
                                value={user.stats.contractsCreated}
                            />
                            <StatItem
                                label="Completion Rate"
                                value={`${Math.round(user.stats.completionRate)}%`}
                            />
                            <StatItem
                                label="Total Spent"
                                value={`${user.stats.totalSpent} credits`}
                            />
                            <StatItem
                                label="Active Contracts"
                                value={user.stats.activeContracts.length}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-bold">{value}</p>
        </div>
    );
}