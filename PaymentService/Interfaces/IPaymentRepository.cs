using PaymentService.Models;

namespace PaymentService.Interfaces;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(int id);

    Task<Payment?> GetByOrderIdAsync(int orderId);

    Task<List<Payment>> GetAllAsync();

    Task<Payment> AddAsync(Payment payment);

    Task UpdateAsync(Payment payment);
}