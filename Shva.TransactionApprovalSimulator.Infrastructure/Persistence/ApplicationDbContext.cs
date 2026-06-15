using Microsoft.EntityFrameworkCore;
using Shva.TransactionApprovalSimulator.Domain.Entities;

namespace Shva.TransactionApprovalSimulator.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();
}
