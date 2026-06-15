using Shva.TransactionApprovalSimulator.Domain.Enums;

namespace Shva.TransactionApprovalSimulator.Application.DTOs.Responses;

public sealed record TransactionResponse(
    Guid Id,
    string Region,
    DateTime SubmittedDateTimeUtc,
    DateTime LocalDateTime,
    TransactionStatus Status);
