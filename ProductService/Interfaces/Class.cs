using ProductService.Models;

namespace ProductService.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(int id);

    Task<Category> AddAsync(Category category);

    Task UpdateAsync(Category category);

    Task DeleteAsync(Category category);
}