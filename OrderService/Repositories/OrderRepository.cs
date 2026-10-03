using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Interfaces;
using OrderService.Models;

namespace OrderService.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly OrderDbContext _context;

    public OrderRepository(OrderDbContext context)
    {
        _context = context;
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<List<Order>> GetByUserIdAsync(int userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ToListAsync();
    }

    public async Task<Order> AddAsync(Order order)
    {
        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return order;
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Orders.Update(order);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Order order)
    {
        _context.Orders.Remove(order);

        await _context.SaveChangesAsync();
    }
}