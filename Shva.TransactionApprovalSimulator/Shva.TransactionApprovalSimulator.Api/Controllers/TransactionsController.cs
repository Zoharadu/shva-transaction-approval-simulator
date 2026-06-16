using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shva.TransactionApprovalSimulator.Application.DTOs.Requests;
using Shva.TransactionApprovalSimulator.Application.DTOs.Responses;
using Shva.TransactionApprovalSimulator.Application.Interfaces;

namespace Shva.TransactionApprovalSimulator.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost("simulate")]
    public async Task<ActionResult<TransactionResponse>> Simulate(
        [FromBody] SubmitTransactionRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _transactionService.SubmitTransactionAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpGet("approved")]
    public async Task<ActionResult<IReadOnlyCollection<ApprovedTransactionResponse>>> GetApproved(
        CancellationToken cancellationToken)
    {
        var response = await _transactionService.GetApprovedTransactionsAsync(cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var response = await _transactionService.GetTransactionByIdAsync(id, cancellationToken);

        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<TransactionResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var response = await _transactionService.GetAllTransactionsAsync(cancellationToken);
        return Ok(response);
    }
}
