using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Interfaces;
using ProductService.Models;

namespace ProductService.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ProductDbContext _context;

    public ProductRepository(ProductDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Inventory)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Inventory)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product> AddAsync(Product product)
    {
        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return product;
    }

    public async Task<List<Product>> GetByCategoryIdAsync(int categoryId)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Product product)
    {
        _context.Products.Remove(product);

        await _context.SaveChangesAsync();
    }
}