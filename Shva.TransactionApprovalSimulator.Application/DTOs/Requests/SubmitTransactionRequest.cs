namespace Shva.TransactionApprovalSimulator.Application.DTOs.Requests;

public sealed record SubmitTransactionRequest(
    string Region,
    DateTime SubmittedDateTime);
