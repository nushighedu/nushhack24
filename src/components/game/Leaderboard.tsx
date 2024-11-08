import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LocalStore } from '@/lib/store';
import type { User } from '@/lib/types';

export function Leaderboard() {
  const users = Object.values(LocalStore.getUsers());
  const contracts = LocalStore.getContracts();

  const userStats = users.map(user => {
    const userContracts = Object.values(contracts).filter(c => 
      c.winner === user.username
    );

    const totalProfit = userContracts.reduce((sum, contract) => {
      if (contract.winningBid) {
        return sum + (contract.trueValue - contract.winningBid);
      }
      return sum;
    }, 0);

    return {
      username: user.username,
      company: user.company.name,
      credits: user.credits,
      contractsWon: userContracts.length,
      totalProfit
    };
  });

  // Sort by total worth (credits + profit)
  const sortedStats = userStats.sort((a, b) => 
    (b.credits + b.totalProfit) - (a.credits + a.totalProfit)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedStats.map((stat, index) => (
            <div 
              key={stat.username}
              className={`
                flex justify-between items-center p-4 rounded-lg
                ${index === 0 ? 'bg-yellow-500/20' : 'bg-gray-800'}
              `}
            >
              <div>
                <p className="font-bold">{index + 1}. {stat.username}</p>
                <p className="text-sm text-gray-400">{stat.company}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{stat.credits + stat.totalProfit} credits</p>
                <p className="text-sm text-gray-400">
                  {stat.contractsWon} contracts won
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}