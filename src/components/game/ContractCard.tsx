import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Contract } from '@/lib/types'

export function ContractCard({
  contract,
  onClick
}: {
  contract: Contract
  onClick: () => void
}) {
  return (
    <Card 
      className="cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{contract.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{contract.description}</p>
        <div className="mt-4">
          <p>Minimum Bid: {contract.minimumBid} credits</p>
          <p>Duration: {contract.expectedDuration} months</p>
          <p>Sustainability Score: {contract.sustainability}/10</p>
        </div>
      </CardContent>
    </Card>
  )
}