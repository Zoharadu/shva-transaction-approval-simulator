using Shva.TransactionApprovalSimulator.Application.DTOs.Requests;
using Shva.TransactionApprovalSimulator.Application.DTOs.Responses;
using Shva.TransactionApprovalSimulator.Application.Interfaces;
using Shva.TransactionApprovalSimulator.Domain.Entities;
using Shva.TransactionApprovalSimulator.Domain.Enums;

namespace Shva.TransactionApprovalSimulator.Application.Services;

public class TransactionService : ITransactionService
{
    private static readonly TimeSpan ApprovalWindowStart = new(8, 0, 0);
    private static readonly TimeSpan ApprovalWindowEnd = new(18, 0, 0);

    private static readonly IReadOnlyDictionary<string, string> RegionTimeZoneIds =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["Israel"] = "Asia/Jerusalem",
            ["France"] = "Europe/Paris",
            ["Japan"] = "Asia/Tokyo",
            ["USA"] = "America/New_York"
        };

    private readonly ITransactionRepository _transactionRepository;

    public TransactionService(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<TransactionResponse> SubmitTransactionAsync(
        SubmitTransactionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Region))
        {
            throw new ArgumentException("Region must not be empty.", nameof(request));
        }

        var timeZone = ResolveTimeZone(request.Region);

        var submittedDateTimeUtc = DateTime.SpecifyKind(request.SubmittedDateTime, DateTimeKind.Utc);
        var localDateTime = TimeZoneInfo.ConvertTimeFromUtc(submittedDateTimeUtc, timeZone);

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Region = request.Region,
            SubmittedDateTimeUtc = submittedDateTimeUtc,
            LocalDateTime = localDateTime,
            Status = DetermineStatus(localDateTime),
            CreatedAt = DateTime.UtcNow
        };

        var savedTransaction = await _transactionRepository.AddAsync(transaction, cancellationToken);

        return MapToTransactionResponse(savedTransaction);
    }

    public async Task<IReadOnlyCollection<ApprovedTransactionResponse>> GetApprovedTransactionsAsync(
        CancellationToken cancellationToken = default)
    {
        var transactions = await _transactionRepository.GetApprovedTransactionsAsync(cancellationToken);

        return transactions
            .Select(MapToApprovedTransactionResponse)
            .ToList();
    }

    public async Task<TransactionResponse?> GetTransactionByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id, cancellationToken);

        return transaction is null
            ? null
            : MapToTransactionResponse(transaction);
    }

    public async Task<IReadOnlyCollection<TransactionResponse>> GetAllTransactionsAsync(
        CancellationToken cancellationToken = default)
    {
        var transactions = await _transactionRepository.GetAllAsync(cancellationToken);

        return transactions
            .Select(MapToTransactionResponse)
            .ToList();
    }

    private static TimeZoneInfo ResolveTimeZone(string region)
    {
        if (!RegionTimeZoneIds.TryGetValue(region, out var timeZoneId))
        {
            throw new ArgumentException(
                $"Unsupported region '{region}'. Supported regions are: {string.Join(", ", RegionTimeZoneIds.Keys)}.",
                nameof(region));
        }

        return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
    }

    private static TransactionStatus DetermineStatus(DateTime localDateTime)
    {
        var timeOfDay = localDateTime.TimeOfDay;

        return timeOfDay >= ApprovalWindowStart && timeOfDay < ApprovalWindowEnd
            ? TransactionStatus.Approved
            : TransactionStatus.Rejected;
    }

    private static TransactionResponse MapToTransactionResponse(Transaction transaction) =>
        new(
            transaction.Id,
            transaction.Region,
            transaction.SubmittedDateTimeUtc,
            transaction.LocalDateTime,
            transaction.Status);

    private static ApprovedTransactionResponse MapToApprovedTransactionResponse(Transaction transaction) =>
        new(
            transaction.Id,
            transaction.Region,
            transaction.LocalDateTime);
}
