using BCrypt.Net;
using UserService.Interfaces;
using UserService.Models;

namespace UserService.Services;

public class UserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _repository.GetByEmailAsync(email);
    }

    public async Task<User> RegisterAsync(
        string firstName,
        string lastName,
        string email,
        string password,
        string role = "Customer")
    {
        var existingUser = await _repository.GetByEmailAsync(email);

        if (existingUser != null)
        {
            throw new InvalidOperationException(
                "A user with this email already exists.");
        }

        var user = new User
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        return await _repository.AddAsync(user);
    }

    public async Task<bool> ValidatePasswordAsync(
        string password,
        string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}