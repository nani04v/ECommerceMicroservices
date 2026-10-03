using Microsoft.Extensions.Caching.Memory;
using ProductService.Interfaces;
using ProductService.Models;

namespace ProductService.Services;

public class ProductService
{
    private readonly IProductRepository _repository;
    private readonly IMemoryCache _cache;

    public ProductService(
        IProductRepository repository,
        IMemoryCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        const string cacheKey = "products_all";

        if (_cache.TryGetValue(cacheKey, out List<Product>? products))
        {
            return products!;
        }

        products = await _repository.GetAllAsync();

        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        };

        _cache.Set(cacheKey, products, cacheOptions);

        return products;
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        var cacheKey = $"product_{id}";

        if (_cache.TryGetValue(cacheKey, out Product? product))
        {
            return product;
        }

        product = await _repository.GetByIdAsync(id);

        if (product != null)
        {
            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            };

            _cache.Set(cacheKey, product, cacheOptions);
        }

        return product;
    }

    public async Task<List<Product>> GetByCategoryIdAsync(int categoryId)
    {
        return await _repository.GetByCategoryIdAsync(categoryId);
    }

    public async Task<Product> AddAsync(Product product)
    {
        var result = await _repository.AddAsync(product);

        _cache.Remove("products_all");

        return result;
    }

    public async Task UpdateAsync(Product product)
    {
        await _repository.UpdateAsync(product);

        _cache.Remove("products_all");
        _cache.Remove($"product_{product.Id}");
    }

    public async Task DeleteAsync(Product product)
    {
        await _repository.DeleteAsync(product);

        _cache.Remove("products_all");
        _cache.Remove($"product_{product.Id}");
    }

    public async Task UpdateInventoryAsync(Inventory inventory)
    {
        var product = await _repository.GetByIdAsync(inventory.ProductId);

        if (product == null)
        {
            throw new InvalidOperationException(
                $"Product {inventory.ProductId} was not found.");
        }

        if (product.Inventory == null)
        {
            throw new InvalidOperationException(
                $"Inventory for product {inventory.ProductId} was not found.");
        }

        product.Inventory.QuantityAvailable =
            inventory.QuantityAvailable;

        product.Inventory.QuantityReserved =
            inventory.QuantityReserved;

        product.Inventory.ReorderLevel =
            inventory.ReorderLevel;

        product.Inventory.UpdatedAt =
            DateTime.UtcNow;

        await _repository.UpdateAsync(product);

        _cache.Remove("products_all");
        _cache.Remove($"product_{inventory.ProductId}");
    }
}