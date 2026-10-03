using OrderService.Models;

namespace OrderService.Interfaces;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync();

    Task<Order?> GetByIdAsync(int id);

    Task<List<Order>> GetByUserIdAsync(int userId);

    Task<Order> AddAsync(Order order);

    Task UpdateAsync(Order order);

    Task DeleteAsync(Order order);
}