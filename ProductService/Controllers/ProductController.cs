using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using ProductService.Models;
using ProductService.Services;

namespace ProductService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly Services.ProductService _service;
    private readonly IMemoryCache _cache;

    public ProductController(
        Services.ProductService service,
        IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await _service.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<List<Product>>> GetByCategoryId(
        int categoryId)
    {
        return Ok(
            await _service.GetByCategoryIdAsync(categoryId)
        );
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        var result = await _service.AddAsync(product);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        Product product)
    {
        var existing = await _service.GetByIdAsync(id);

        if (existing == null)
            return NotFound();

        product.Id = id;

        await _service.UpdateAsync(product);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _service.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        await _service.DeleteAsync(product);

        return NoContent();
    }

    // Reduce available inventory after an order is placed
    [HttpPut("{id}/inventory")]
    public async Task<IActionResult> UpdateInventory(
        int id,
        [FromQuery] int quantity)
    {
        if (quantity <= 0)
            return BadRequest("Quantity must be greater than zero.");

        var product = await _service.GetByIdAsync(id);

        if (product == null)
            return NotFound();

        if (product.Inventory == null)
            return BadRequest("Inventory does not exist for this product.");

        if (product.Inventory.QuantityAvailable < quantity)
            return BadRequest("Insufficient inventory.");

        product.Inventory.QuantityAvailable -= quantity;
        product.Inventory.UpdatedAt = DateTime.UtcNow;

        await _service.UpdateInventoryAsync(product.Inventory);

        return Ok(new
        {
            productId = id,
            quantityAvailable = product.Inventory.QuantityAvailable
        });
    }
}