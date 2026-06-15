using Shva.TransactionApprovalSimulator.Application.DTOs.Requests;
using Shva.TransactionApprovalSimulator.Application.DTOs.Responses;

namespace Shva.TransactionApprovalSimulator.Application.Interfaces;

public interface ITransactionService
{
    Task<TransactionResponse> SubmitTransactionAsync(
        SubmitTransactionRequest request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ApprovedTransactionResponse>> GetApprovedTransactionsAsync(
        CancellationToken cancellationToken = default);

    Task<TransactionResponse?> GetTransactionByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TransactionResponse>> GetAllTransactionsAsync(
        CancellationToken cancellationToken = default);
}
