using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Models;

namespace OrderService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly Services.OrderService _service;

    public OrderController(Services.OrderService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<Order>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetById(int id)
    {
        var order = await _service.GetByIdAsync(id);

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<Order>>> GetByUserId(int userId)
    {
        return Ok(await _service.GetByUserIdAsync(userId));
    }

    [HttpPost]
    public async Task<ActionResult<Order>> Create(Order order)
    {
        var result = await _service.AddAsync(order);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        Order order)
    {
        var existing = await _service.GetByIdAsync(id);

        if (existing == null)
            return NotFound();

        order.Id = id;

        await _service.UpdateAsync(order);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var order = await _service.GetByIdAsync(id);

        if (order == null)
            return NotFound();

        await _service.DeleteAsync(order);

        return NoContent();
    }
}