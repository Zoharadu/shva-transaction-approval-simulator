import { useEffect, useState } from 'react'
import { getApprovedTransactions } from '../../api/transactionsApi'
import type { ApprovedTransaction, ApprovedTransactionResponse } from '../../types/transactions'
import { getErrorMessage } from '../../utils/errors'
import { TransactionCard } from './TransactionCard'
import { TransactionsManagementPanel } from './TransactionsManagementPanel'

type ApprovedTransactionsCarouselProps = {
  refreshKey: number
}

const DESKTOP_VISIBLE_TRANSACTION_COUNT = 3
const MEDIUM_VISIBLE_TRANSACTION_COUNT = 2
const SMALL_VISIBLE_TRANSACTION_COUNT = 1
const MEDIUM_SCREEN_QUERY = '(max-width: 940px)'
const SMALL_SCREEN_QUERY = '(max-width: 620px)'

const getVisibleTransactionCount = () => {
  if (typeof window === 'undefined') {
    return DESKTOP_VISIBLE_TRANSACTION_COUNT
  }

  if (window.matchMedia(SMALL_SCREEN_QUERY).matches) {
    return SMALL_VISIBLE_TRANSACTION_COUNT
  }

  if (window.matchMedia(MEDIUM_SCREEN_QUERY).matches) {
    return MEDIUM_VISIBLE_TRANSACTION_COUNT
  }

  return DESKTOP_VISIBLE_TRANSACTION_COUNT
}

const formatTransactionTime = (localDateTime: string) => {
  const timeMatch = localDateTime.match(/T(\d{2}):(\d{2})/)

  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]}`
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(localDateTime))
}

const mapApprovedTransaction = (
  transaction: ApprovedTransactionResponse,
): ApprovedTransaction => ({
  id: transaction.id,
  time: formatTransactionTime(transaction.localDateTime),
  region: transaction.region,
})

const sortNewestLocalTimeFirst = (
  transactions: ApprovedTransactionResponse[],
) => {
  return [...transactions].sort(
    (first, second) =>
      new Date(second.localDateTime).getTime() - new Date(first.localDateTime).getTime(),
  )
}

export function ApprovedTransactionsCarousel({ refreshKey }: ApprovedTransactionsCarouselProps) {
  const [approvedTransactions, setApprovedTransactions] = useState<ApprovedTransaction[]>([])
  const [visibleStartIndex, setVisibleStartIndex] = useState(0)
  const [visibleTransactionCount, setVisibleTransactionCount] = useState(getVisibleTransactionCount)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isManagementPanelOpen, setIsManagementPanelOpen] = useState(false)

  const lastStartIndex = Math.max(approvedTransactions.length - visibleTransactionCount, 0)
  const visibleTransactions = approvedTransactions.slice(
    visibleStartIndex,
    visibleStartIndex + visibleTransactionCount,
  )
  const canMoveBackward = !isLoading && !loadError && visibleStartIndex > 0
  const canMoveForward = !isLoading && !loadError && visibleStartIndex < lastStartIndex

  useEffect(() => {
    const handleResize = () => {
      setVisibleTransactionCount(getVisibleTransactionCount())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setVisibleStartIndex((startIndex) => Math.min(startIndex, lastStartIndex))
  }, [lastStartIndex])

  useEffect(() => {
    let isActive = true

    const loadApprovedTransactions = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        const transactions = await getApprovedTransactions()

        if (isActive) {
          setApprovedTransactions(
            sortNewestLocalTimeFirst(transactions).map(mapApprovedTransaction),
          )
          setVisibleStartIndex(0)
        }
      } catch (error) {
        if (isActive) {
          setLoadError(getErrorMessage(error, 'Unable to load approved transactions.'))
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadApprovedTransactions()

    return () => {
      isActive = false
    }
  }, [refreshKey])

  const handlePrevious = () => {
    setVisibleStartIndex((startIndex) => Math.max(startIndex - 1, 0))
  }

  const handleNext = () => {
    setVisibleStartIndex((startIndex) => Math.min(startIndex + 1, lastStartIndex))
  }

  return (
    <section className="approved-section" aria-labelledby="approved-title">
      <div className="approved-header">
        <h2 id="approved-title">Approved Transactions</h2>
        <button
          type="button"
          className="secondary-panel-toggle"
          aria-expanded={isManagementPanelOpen}
          aria-controls="all-transactions-panel"
          onClick={() => setIsManagementPanelOpen((isOpen) => !isOpen)}
        >
          All Transactions
        </button>
      </div>
      <div className="carousel-row">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous approved transactions"
          disabled={!canMoveBackward}
          onClick={handlePrevious}
        >
          ‹
        </button>
        <div className="transaction-list">
          {isLoading && (
            <article className="transaction-card transaction-card-status">
              Loading approved transactions...
            </article>
          )}
          {loadError && <article className="transaction-card transaction-card-status">{loadError}</article>}
          {!isLoading && !loadError && approvedTransactions.length === 0 && (
            <article className="transaction-card transaction-card-status">
              No approved transactions yet.
            </article>
          )}
          {!isLoading &&
            !loadError &&
            visibleTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
        </div>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next approved transactions"
          disabled={!canMoveForward}
          onClick={handleNext}
        >
          ›
        </button>
      </div>
      {isManagementPanelOpen && <TransactionsManagementPanel refreshKey={refreshKey} />}
    </section>
  )
}
