using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Interfaces;
using ProductService.Models;

namespace ProductService.Repositories;

public class InventoryRepository : IInventoryRepository
{
    private readonly ProductDbContext _context;

    public InventoryRepository(ProductDbContext context)
    {
        _context = context;
    }

    public async Task<List<Inventory>> GetAllAsync()
    {
        return await _context.Inventories
            .Include(i => i.Product)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Inventory?> GetByIdAsync(int id)
    {
        return await _context.Inventories
            .Include(i => i.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<Inventory?> GetByProductIdAsync(int productId)
    {
        return await _context.Inventories
            .Include(i => i.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.ProductId == productId);
    }

    public async Task<Inventory> AddAsync(Inventory inventory)
    {
        _context.Inventories.Add(inventory);
        await _context.SaveChangesAsync();

        return inventory;
    }

    public async Task UpdateAsync(Inventory inventory)
    {
        _context.Inventories.Update(inventory);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Inventory inventory)
    {
        _context.Inventories.Remove(inventory);
        await _context.SaveChangesAsync();
    }
}