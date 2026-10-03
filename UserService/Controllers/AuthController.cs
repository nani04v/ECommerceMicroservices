using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserService.Services;

namespace UserService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly Services.UserService _service;
    private readonly IConfiguration _configuration;

    public AuthController(
        Services.UserService service,
        IConfiguration configuration)
    {
        _service = service;
        _configuration = configuration;
    }

    // REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            // Public registration always creates a Customer.
            // The client cannot choose the Admin role.
            var user = await _service.RegisterAsync(
                request.FirstName,
                request.LastName,
                request.Email,
                request.Password,
                "Customer");

            return Ok(new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Role
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    // LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _service.GetByEmailAsync(request.Email);

        if (user == null || !user.IsActive)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var validPassword = await _service.ValidatePasswordAsync(
            request.Password,
            user.PasswordHash);

        if (!validPassword)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var token = GenerateToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Role
            }
        });
    }

    // JWT TOKEN GENERATION
    private string GenerateToken(Models.User user)
    {
        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new(
                ClaimTypes.Email,
                user.Email),

            new(
                ClaimTypes.Name,
                user.FirstName),

            new(
                ClaimTypes.Role,
                user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}

// REGISTER REQUEST
public class RegisterRequest
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    // Kept for request compatibility,
    // but it is intentionally ignored during registration.
    public string? Role { get; set; }
}

// LOGIN REQUEST
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}