using Shva.TransactionApprovalSimulator.Domain.Enums;

namespace Shva.TransactionApprovalSimulator.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; }

    public string Region { get; set; } = string.Empty;

    public DateTime SubmittedDateTimeUtc { get; set; }

    public DateTime LocalDateTime { get; set; }

    public TransactionStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}
