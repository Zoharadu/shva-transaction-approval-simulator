using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Shva.TransactionApprovalSimulator.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string DemoUsername = "admin";
    private const string DemoPassword = "admin";

    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (!IsValidDemoUser(request))
        {
            return Unauthorized();
        }

        var token = CreateToken(request.Username);
        return Ok(new LoginResponse(token));
    }

    private static bool IsValidDemoUser(LoginRequest request)
    {
        return string.Equals(request.Username, DemoUsername, StringComparison.Ordinal)
            && string.Equals(request.Password, DemoPassword, StringComparison.Ordinal);
    }

    private string CreateToken(string username)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var jwtKey = jwtSettings["Key"] ?? throw new InvalidOperationException("Missing JwtSettings:Key configuration.");
        var expiresInMinutes = jwtSettings.GetValue("ExpiresInMinutes", 60);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, username)
        };

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public sealed record LoginRequest(string Username, string Password);

public sealed record LoginResponse(string Token);
