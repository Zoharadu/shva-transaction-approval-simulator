namespace Shva.TransactionApprovalSimulator.Application.DTOs.Responses;

public sealed record ApprovedTransactionResponse(
    Guid Id,
    string Region,
    DateTime LocalDateTime);
