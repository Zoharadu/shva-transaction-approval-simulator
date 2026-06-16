import { useEffect, useState } from 'react'
import { getTransactionById, getTransactions } from '../../api/transactionsApi'
import { TransactionStatus, type TransactionResponse } from '../../types/transactions'
import { getErrorMessage } from '../../utils/errors'

type TransactionsManagementPanelProps = {
  refreshKey: number
}

const getStatusLabel = (status: TransactionResponse['status']) => {
  return status === TransactionStatus.Approved ? 'Approved' : 'Rejected'
}

const isNotFoundError = (error: unknown) => {
  return error instanceof Error && error.message.includes('status 404')
}

const sortNewestFirst = (transactions: TransactionResponse[]) => {
  return [...transactions].sort(
    (first, second) =>
      new Date(second.localDateTime).getTime() - new Date(first.localDateTime).getTime(),
  )
}

export function TransactionsManagementPanel({ refreshKey }: TransactionsManagementPanelProps) {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)
  const [searchId, setSearchId] = useState('')
  const [foundTransaction, setFoundTransaction] = useState<TransactionResponse | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadTransactions = async () => {
      setIsLoadingTransactions(true)
      setTransactionsError(null)

      try {
        const response = await getTransactions()

        if (isActive) {
          setTransactions(sortNewestFirst(response))
        }
      } catch (error) {
        if (isActive) {
          setTransactionsError(getErrorMessage(error, 'Unable to load transactions.'))
        }
      } finally {
        if (isActive) {
          setIsLoadingTransactions(false)
        }
      }
    }

    void loadTransactions()

    return () => {
      isActive = false
    }
  }, [refreshKey])

  const handleSearch = async () => {
    const trimmedId = searchId.trim()

    setFoundTransaction(null)
    setSearchError(null)

    if (!trimmedId) {
      setSearchError('Enter a transaction ID to search.')
      return
    }

    setIsSearching(true)

    try {
      const transaction = await getTransactionById(trimmedId)
      setFoundTransaction(transaction)
    } catch (error) {
      setSearchError(
        isNotFoundError(error)
          ? 'No transaction found for that ID.'
          : getErrorMessage(error, 'Unable to search for transaction.'),
      )
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="transactions-management-panel" id="all-transactions-panel">
      <div className="transaction-search-card">
        <div>
          <h3>Find Transaction</h3>
          <p>Search by transaction ID for full details.</p>
        </div>
        <div className="transaction-search-form">
          <input
            type="search"
            value={searchId}
            placeholder="Transaction ID"
            aria-label="Transaction ID"
            onChange={(event) => setSearchId(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void handleSearch()
              }
            }}
          />
          <button type="button" disabled={isSearching} onClick={() => void handleSearch()}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchError && <p className="panel-message" role="alert">{searchError}</p>}
        {foundTransaction && (
          <TransactionDetailsCard transaction={foundTransaction} />
        )}
      </div>

      <div className="all-transactions-card">
        <div className="transactions-panel-heading">
          <h3>All Transactions</h3>
          <span>{transactions.length} total</span>
        </div>
        {isLoadingTransactions && <p className="panel-message">Loading transactions...</p>}
        {transactionsError && <p className="panel-message" role="alert">{transactionsError}</p>}
        {!isLoadingTransactions && !transactionsError && transactions.length === 0 && (
          <p className="panel-message">No transactions yet.</p>
        )}
        {!isLoadingTransactions && !transactionsError && transactions.length > 0 && (
          <div className="transactions-table" role="table" aria-label="All transactions">
            <div className="transactions-table-row transactions-table-header" role="row">
              <span role="columnheader">ID</span>
              <span role="columnheader">Region</span>
              <span role="columnheader">Local Date Time</span>
              <span role="columnheader">Status</span>
            </div>
            {transactions.map((transaction) => (
              <div className="transactions-table-row" role="row" key={transaction.id}>
                <span role="cell">{transaction.id}</span>
                <span role="cell">{transaction.region}</span>
                <span role="cell">{transaction.localDateTime}</span>
                <span role="cell">
                  <span className={`status-pill status-${getStatusLabel(transaction.status).toLowerCase()}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TransactionDetailsCard({ transaction }: { transaction: TransactionResponse }) {
  return (
    <dl className="transaction-details-card">
      <div>
        <dt>ID</dt>
        <dd>{transaction.id}</dd>
      </div>
      <div>
        <dt>Region</dt>
        <dd>{transaction.region}</dd>
      </div>
      <div>
        <dt>Local Date Time</dt>
        <dd>{transaction.localDateTime}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>{getStatusLabel(transaction.status)}</dd>
      </div>
    </dl>
  )
}
