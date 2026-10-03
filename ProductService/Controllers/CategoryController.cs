using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Models;
using ProductService.Services;

namespace ProductService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly CategoryService _service;

    public CategoryController(CategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById(int id)
    {
        var category = await _service.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Category>> Create(Category category)
    {
        var result = await _service.AddAsync(category);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        Category category)
    {
        var existing = await _service.GetByIdAsync(id);

        if (existing == null)
            return NotFound();

        existing.Name = category.Name;
        existing.Description = category.Description;
        existing.IsActive = category.IsActive;

        await _service.UpdateAsync(existing);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _service.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        await _service.DeleteAsync(category);

        return NoContent();
    }
}