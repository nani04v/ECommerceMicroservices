using ProductService.Models;

namespace ProductService.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();

    Task<Product?> GetByIdAsync(int id);

    Task<Product> AddAsync(Product product);

    Task<List<Product>> GetByCategoryIdAsync(int categoryId);

    Task UpdateAsync(Product product);

    Task DeleteAsync(Product product);
}