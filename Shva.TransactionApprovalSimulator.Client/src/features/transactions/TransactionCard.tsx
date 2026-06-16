import type { ApprovedTransaction } from '../../types/transactions'

type TransactionCardProps = {
  transaction: ApprovedTransaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <article className="transaction-card">
      <strong>Time: {transaction.time}</strong>
      <span>Time Zone: {transaction.region}</span>
    </article>
  )
}
