using ProductService.Models;

namespace ProductService.Interfaces;

public interface IInventoryRepository
{
    Task<List<Inventory>> GetAllAsync();

    Task<Inventory?> GetByIdAsync(int id);

    Task<Inventory?> GetByProductIdAsync(int productId);

    Task<Inventory> AddAsync(Inventory inventory);

    Task UpdateAsync(Inventory inventory);

    Task DeleteAsync(Inventory inventory);
}