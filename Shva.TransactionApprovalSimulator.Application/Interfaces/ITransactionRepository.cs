using Shva.TransactionApprovalSimulator.Domain.Entities;

namespace Shva.TransactionApprovalSimulator.Application.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction> AddAsync(
        Transaction transaction,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Transaction>> GetApprovedTransactionsAsync(
        CancellationToken cancellationToken = default);

    Task<Transaction?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Transaction>> GetAllAsync(
        CancellationToken cancellationToken = default);
}
