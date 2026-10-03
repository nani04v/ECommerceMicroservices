using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Models;

namespace UserService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly Services.UserService _service;

    public UserController(Services.UserService service)
    {
        _service = service;
    }

    // GET: api/User
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<User>>> GetAll()
    {
        var users = await _service.GetAllAsync();

        return Ok(users);
    }

    // GET: api/User/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(int id)
    {
        var user = await _service.GetByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
}