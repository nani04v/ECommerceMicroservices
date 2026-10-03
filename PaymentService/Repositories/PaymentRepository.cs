using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Interfaces;
using PaymentService.Models;

namespace PaymentService.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly PaymentDbContext _context;

    public PaymentRepository(PaymentDbContext context)
    {
        _context = context;
    }

    public async Task<Payment?> GetByIdAsync(int id)
    {
        return await _context.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Payment?> GetByOrderIdAsync(int orderId)
    {
        return await _context.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.OrderId == orderId);
    }

    public async Task<List<Payment>> GetAllAsync()
    {
        return await _context.Payments
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Payment> AddAsync(Payment payment)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return payment;
    }

    public async Task UpdateAsync(Payment payment)
    {
        _context.Payments.Update(payment);
        await _context.SaveChangesAsync();
    }
}