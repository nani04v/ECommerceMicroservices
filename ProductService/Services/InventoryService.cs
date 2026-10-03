using ProductService.Interfaces;
using ProductService.Models;

namespace ProductService.Services;

public class InventoryService
{
    private readonly IInventoryRepository _repository;

    public InventoryService(IInventoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Inventory>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Inventory?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Inventory?> GetByProductIdAsync(int productId)
    {
        return await _repository.GetByProductIdAsync(productId);
    }

    public async Task<Inventory> AddAsync(Inventory inventory)
    {
        inventory.UpdatedAt = DateTime.UtcNow;

        return await _repository.AddAsync(inventory);
    }

    public async Task UpdateAsync(Inventory inventory)
    {
        inventory.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(inventory);
    }

    public async Task DeleteAsync(Inventory inventory)
    {
        await _repository.DeleteAsync(inventory);
    }
}