using PaymentService.Interfaces;
using PaymentService.Models;

namespace PaymentService.Services;

public class PaymentService
{
    private readonly IPaymentRepository _repository;

    public PaymentService(IPaymentRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Payment>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Payment?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Payment?> GetByOrderIdAsync(int orderId)
    {
        return await _repository.GetByOrderIdAsync(orderId);
    }

    public async Task<Payment> ProcessPaymentAsync(
        int orderId,
        decimal amount,
        string paymentMethod)
    {
        var existingPayment =
            await _repository.GetByOrderIdAsync(orderId);

        if (existingPayment != null)
        {
            return existingPayment;
        }

        var payment = new Payment
        {
            OrderId = orderId,
            Amount = amount,
            PaymentMethod = paymentMethod,
            Status = "Success",
            TransactionId = Guid.NewGuid().ToString(),
            CreatedAt = DateTime.UtcNow
        };

        return await _repository.AddAsync(payment);
    }

    public async Task UpdateStatusAsync(
        Payment payment,
        string status)
    {
        payment.Status = status;

        await _repository.UpdateAsync(payment);
    }
}