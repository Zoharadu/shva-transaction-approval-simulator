using Shva.TransactionApprovalSimulator.Application.DTOs.Requests;
using Shva.TransactionApprovalSimulator.Application.Interfaces;
using Shva.TransactionApprovalSimulator.Application.Services;
using Shva.TransactionApprovalSimulator.Domain.Entities;
using Shva.TransactionApprovalSimulator.Domain.Enums;

namespace Shva.TransactionApprovalSimulator.Tests;

public class TransactionServiceTests
{
    [Fact]
    public async Task SubmitTransactionAsync_ReturnsApproved_DuringBankingHours()
    {
        var repository = new InMemoryTransactionRepository();
        var service = new TransactionService(repository);
        var request = new SubmitTransactionRequest(
            "Israel",
            new DateTime(2026, 1, 15, 10, 0, 0, DateTimeKind.Utc));

        var result = await service.SubmitTransactionAsync(request);

        Assert.Equal(TransactionStatus.Approved, result.Status);
        Assert.Equal("Israel", result.Region);
        Assert.Equal(new DateTime(2026, 1, 15, 12, 0, 0), result.LocalDateTime);
    }

    [Fact]
    public async Task SubmitTransactionAsync_ReturnsRejected_OutsideBankingHours()
    {
        var repository = new InMemoryTransactionRepository();
        var service = new TransactionService(repository);
        var request = new SubmitTransactionRequest(
            "Israel",
            new DateTime(2026, 1, 15, 16, 0, 0, DateTimeKind.Utc));

        var result = await service.SubmitTransactionAsync(request);

        Assert.Equal(TransactionStatus.Rejected, result.Status);
        Assert.Equal(new DateTime(2026, 1, 15, 18, 0, 0), result.LocalDateTime);
    }

    [Fact]
    public async Task SubmitTransactionAsync_ThrowsArgumentException_ForUnsupportedRegion()
    {
        var repository = new InMemoryTransactionRepository();
        var service = new TransactionService(repository);
        var request = new SubmitTransactionRequest(
            "Atlantis",
            new DateTime(2026, 1, 15, 10, 0, 0, DateTimeKind.Utc));

        await Assert.ThrowsAsync<ArgumentException>(() => service.SubmitTransactionAsync(request));
    }

    [Fact]
    public async Task GetTransactionByIdAsync_ReturnsNull_WhenTransactionDoesNotExist()
    {
        var repository = new InMemoryTransactionRepository();
        var service = new TransactionService(repository);

        var result = await service.GetTransactionByIdAsync(Guid.NewGuid());

        Assert.Null(result);
    }

    [Fact]
    public async Task GetApprovedTransactionsAsync_ReturnsApprovedTransactionsMappedCorrectly()
    {
        var approvedTransactionId = Guid.NewGuid();
        var approvedLocalDateTime = new DateTime(2026, 1, 15, 12, 0, 0);
        var rejectedTransactionId = Guid.NewGuid();
        var repository = new InMemoryTransactionRepository(
            new Transaction
            {
                Id = approvedTransactionId,
                Region = "France",
                SubmittedDateTimeUtc = new DateTime(2026, 1, 15, 11, 0, 0, DateTimeKind.Utc),
                LocalDateTime = approvedLocalDateTime,
                Status = TransactionStatus.Approved,
                CreatedAt = new DateTime(2026, 1, 15, 11, 0, 0, DateTimeKind.Utc)
            },
            new Transaction
            {
                Id = rejectedTransactionId,
                Region = "Japan",
                SubmittedDateTimeUtc = new DateTime(2026, 1, 15, 20, 0, 0, DateTimeKind.Utc),
                LocalDateTime = new DateTime(2026, 1, 16, 5, 0, 0),
                Status = TransactionStatus.Rejected,
                CreatedAt = new DateTime(2026, 1, 15, 20, 0, 0, DateTimeKind.Utc)
            });
        var service = new TransactionService(repository);

        var result = await service.GetApprovedTransactionsAsync();

        var approvedTransaction = Assert.Single(result);
        Assert.Equal(approvedTransactionId, approvedTransaction.Id);
        Assert.Equal("France", approvedTransaction.Region);
        Assert.Equal(approvedLocalDateTime, approvedTransaction.LocalDateTime);
    }

    private sealed class InMemoryTransactionRepository : ITransactionRepository
    {
        private readonly List<Transaction> _transactions;

        public InMemoryTransactionRepository(params Transaction[] transactions)
        {
            _transactions = transactions.ToList();
        }

        public Task<Transaction> AddAsync(
            Transaction transaction,
            CancellationToken cancellationToken = default)
        {
            _transactions.Add(transaction);

            return Task.FromResult(transaction);
        }

        public Task<IReadOnlyCollection<Transaction>> GetApprovedTransactionsAsync(
            CancellationToken cancellationToken = default)
        {
            IReadOnlyCollection<Transaction> approvedTransactions = _transactions
                .Where(transaction => transaction.Status == TransactionStatus.Approved)
                .ToList();

            return Task.FromResult(approvedTransactions);
        }

        public Task<Transaction?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            var transaction = _transactions.SingleOrDefault(transaction => transaction.Id == id);

            return Task.FromResult(transaction);
        }

        public Task<IReadOnlyCollection<Transaction>> GetAllAsync(
            CancellationToken cancellationToken = default)
        {
            IReadOnlyCollection<Transaction> transactions = _transactions.ToList();

            return Task.FromResult(transactions);
        }
    }
}
