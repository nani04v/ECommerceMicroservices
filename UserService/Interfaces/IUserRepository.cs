using UserService.Models;

namespace UserService.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);

    Task<User?> GetByEmailAsync(string email);

    Task<List<User>> GetAllAsync();

    Task<User> AddAsync(User user);

    Task UpdateAsync(User user);
}