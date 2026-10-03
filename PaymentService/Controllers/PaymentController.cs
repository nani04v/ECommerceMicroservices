using Microsoft.AspNetCore.Mvc;
using PaymentService.Models;
using Microsoft.AspNetCore.Authorization;


namespace PaymentService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly Services.PaymentService _service;

    public PaymentController(Services.PaymentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Payment>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Payment>> GetById(int id)
    {
        var payment = await _service.GetByIdAsync(id);

        if (payment == null)
            return NotFound();

        return Ok(payment);
    }

    [HttpGet("order/{orderId}")]
    public async Task<ActionResult<Payment>> GetByOrderId(int orderId)
    {
        var payment = await _service.GetByOrderIdAsync(orderId);

        if (payment == null)
            return NotFound();

        return Ok(payment);
    }

    [HttpPost]
    public async Task<ActionResult<Payment>> ProcessPayment(
        PaymentRequest request)
    {
        var payment = await _service.ProcessPaymentAsync(
            request.OrderId,
            request.Amount,
            request.PaymentMethod);

        return Ok(payment);
    }
}

public class PaymentRequest
{
    public int OrderId { get; set; }

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = "Mock";
}