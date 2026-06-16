using Microsoft.EntityFrameworkCore;
using Shva.TransactionApprovalSimulator.Api.Middleware;
using Shva.TransactionApprovalSimulator.Application.Interfaces;
using Shva.TransactionApprovalSimulator.Application.Services;
using Shva.TransactionApprovalSimulator.Infrastructure.Persistence;
using Shva.TransactionApprovalSimulator.Infrastructure.Repositories;

const string ReactDevelopmentCorsPolicy = "ReactDevelopmentCorsPolicy";

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(ReactDevelopmentCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(ReactDevelopmentCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
