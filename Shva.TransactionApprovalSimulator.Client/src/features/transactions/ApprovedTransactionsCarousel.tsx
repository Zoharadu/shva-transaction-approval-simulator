import type { ApprovedTransaction } from '../../types/transactions'
import { TransactionCard } from './TransactionCard'

const approvedTransactions: ApprovedTransaction[] = [
  { id: 1, time: '14:24', region: 'France' },
  { id: 2, time: '14:24', region: 'France' },
  { id: 3, time: '14:24', region: 'France' },
]

export function ApprovedTransactionsCarousel() {
  return (
    <section className="approved-section" aria-labelledby="approved-title">
      <h2 id="approved-title">Approved Transactions</h2>
      <div className="carousel-row">
        <button type="button" className="carousel-arrow" aria-label="Previous approved transactions">
          ‹
        </button>
        <div className="transaction-list">
          {approvedTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
        <button type="button" className="carousel-arrow" aria-label="Next approved transactions">
          ›
        </button>
      </div>
    </section>
  )
}
