using Microsoft.EntityFrameworkCore;
using Shva.TransactionApprovalSimulator.Application.Interfaces;
using Shva.TransactionApprovalSimulator.Domain.Entities;
using Shva.TransactionApprovalSimulator.Domain.Enums;
using Shva.TransactionApprovalSimulator.Infrastructure.Persistence;

namespace Shva.TransactionApprovalSimulator.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TransactionRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Transaction> AddAsync(
        Transaction transaction,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Transactions.AddAsync(transaction, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return transaction;
    }

    public async Task<IReadOnlyCollection<Transaction>> GetApprovedTransactionsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Transactions
            .Where(t => t.Status == TransactionStatus.Approved)
            .ToListAsync(cancellationToken);
    }

    public async Task<Transaction?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Transactions
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Transaction>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Transactions
            .ToListAsync(cancellationToken);
    }
}
