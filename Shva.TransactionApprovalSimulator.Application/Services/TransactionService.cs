using Shva.TransactionApprovalSimulator.Application.DTOs.Requests;
using Shva.TransactionApprovalSimulator.Application.DTOs.Responses;
using Shva.TransactionApprovalSimulator.Application.Interfaces;

namespace Shva.TransactionApprovalSimulator.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;

    public TransactionService(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public Task<TransactionResponse> SubmitTransactionAsync(
        SubmitTransactionRequest request,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyCollection<ApprovedTransactionResponse>> GetApprovedTransactionsAsync(
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<TransactionResponse?> GetTransactionByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyCollection<TransactionResponse>> GetAllTransactionsAsync(
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
