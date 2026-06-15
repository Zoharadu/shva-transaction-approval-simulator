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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.SubmittedDateTimeUtc)
                .HasColumnType("timestamp with time zone");

            entity.Property(t => t.LocalDateTime)
                .HasColumnType("timestamp without time zone");

            entity.Property(t => t.CreatedAt)
                .HasColumnType("timestamp with time zone");
        });
    }
}
