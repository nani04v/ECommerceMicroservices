using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Models;
using ProductService.Services;

namespace ProductService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _service;

    public InventoryController(InventoryService service)
    {
        _service = service;
    }

    // GET: api/Inventory
    [HttpGet]
    public async Task<ActionResult<List<Inventory>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    // GET: api/Inventory/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Inventory>> GetById(int id)
    {
        var inventory = await _service.GetByIdAsync(id);

        if (inventory == null)
            return NotFound();

        return Ok(inventory);
    }

    // GET: api/Inventory/product/5
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<Inventory>> GetByProductId(
        int productId)
    {
        var inventory =
            await _service.GetByProductIdAsync(productId);

        if (inventory == null)
            return NotFound();

        return Ok(inventory);
    }

    // POST: api/Inventory
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Inventory>> Create(
        Inventory inventory)
    {
        var existing =
            await _service.GetByProductIdAsync(inventory.ProductId);

        if (existing != null)
        {
            return Conflict(new
            {
                message = "Inventory already exists for this product."
            });
        }

        var result = await _service.AddAsync(inventory);

        return Ok(result);
    }

    // PUT: api/Inventory/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        Inventory inventory)
    {
        var existing = await _service.GetByIdAsync(id);

        if (existing == null)
            return NotFound();

        existing.ProductId = inventory.ProductId;
        existing.QuantityAvailable =
            inventory.QuantityAvailable;
        existing.QuantityReserved =
            inventory.QuantityReserved;
        existing.ReorderLevel =
            inventory.ReorderLevel;

        await _service.UpdateAsync(existing);

        return NoContent();
    }

    // DELETE: api/Inventory/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var inventory = await _service.GetByIdAsync(id);

        if (inventory == null)
            return NotFound();

        await _service.DeleteAsync(inventory);

        return NoContent();
    }
}