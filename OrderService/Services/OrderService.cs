using Microsoft.AspNetCore.SignalR;
using OrderService.Hubs;
using OrderService.Interfaces;
using OrderService.Models;

namespace OrderService.Services;

public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IHubContext<OrderHub> _hubContext;

    public OrderService(
        IOrderRepository repository,
        IHttpClientFactory httpClientFactory,
        IHttpContextAccessor httpContextAccessor,
        IHubContext<OrderHub> hubContext)
    {
        _repository = repository;
        _httpClient = httpClientFactory.CreateClient();
        _httpContextAccessor = httpContextAccessor;
        _hubContext = hubContext;
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<List<Order>> GetByUserIdAsync(int userId)
    {
        return await _repository.GetByUserIdAsync(userId);
    }

    public async Task<Order> AddAsync(Order order)
    {
        order.CreatedAt = DateTime.UtcNow;
        order.Status = "Pending";

        // Forward the user's JWT token to other microservices
        var token = _httpContextAccessor.HttpContext?
            .Request.Headers.Authorization.ToString();

        if (!string.IsNullOrEmpty(token))
        {
            _httpClient.DefaultRequestHeaders.Remove("Authorization");

            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation(
                "Authorization",
                token);
        }

        decimal calculatedTotal = 0;

        // Validate products and calculate the order total
        foreach (var item in order.OrderItems)
        {
            var product = await _httpClient.GetFromJsonAsync<ProductResponse>(
                $"http://product-service/api/Product/{item.ProductId}");

            if (product == null)
            {
                throw new InvalidOperationException(
                    $"Product {item.ProductId} was not found.");
            }

            if (!product.IsActive)
            {
                throw new InvalidOperationException(
                    $"Product {item.ProductId} is not active.");
            }

            if (product.Inventory == null ||
                product.Inventory.QuantityAvailable < item.Quantity)
            {
                throw new InvalidOperationException(
                    $"Insufficient inventory for product {item.ProductId}.");
            }

            item.UnitPrice = product.Price;
            item.TotalPrice = product.Price * item.Quantity;

            calculatedTotal += item.TotalPrice;
        }

        order.TotalAmount = calculatedTotal;

        // Create the order
        var createdOrder = await _repository.AddAsync(order);

        // Create payment
        var paymentRequest = new
        {
            OrderId = createdOrder.Id,
            Amount = createdOrder.TotalAmount,
            PaymentMethod = "Mock"
        };

        var response = await _httpClient.PostAsJsonAsync(
            "http://payment-service/api/Payment",
            paymentRequest);

        if (response.IsSuccessStatusCode)
        {
            // Reduce inventory after successful payment
            foreach (var item in createdOrder.OrderItems)
            {
                var inventoryResponse = await _httpClient.PutAsync(
                    $"http://product-service/api/Product/{item.ProductId}/inventory?quantity={item.Quantity}",
                    null);

                if (!inventoryResponse.IsSuccessStatusCode)
                {
                    throw new InvalidOperationException(
                        $"Failed to update inventory for product {item.ProductId}.");
                }
            }

            // Confirm the order
            createdOrder.Status = "Confirmed";

            await _repository.UpdateAsync(createdOrder);
        }

        // Notify clients subscribed to this order
        await _hubContext.Clients
            .Group($"order-{createdOrder.Id}")
            .SendAsync(
                "OrderStatusUpdated",
                new
                {
                    orderId = createdOrder.Id,
                    status = createdOrder.Status
                });

        return createdOrder;
    }

    public async Task UpdateAsync(Order order)
    {
        order.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(order);

        // Notify clients when the order status changes
        await _hubContext.Clients
            .Group($"order-{order.Id}")
            .SendAsync(
                "OrderStatusUpdated",
                new
                {
                    orderId = order.Id,
                    status = order.Status
                });
    }

    public async Task DeleteAsync(Order order)
    {
        await _repository.DeleteAsync(order);
    }
}

public class ProductResponse
{
    public int Id { get; set; }

    public decimal Price { get; set; }

    public bool IsActive { get; set; }

    public InventoryResponse? Inventory { get; set; }
}

public class InventoryResponse
{
    public int QuantityAvailable { get; set; }

    public int QuantityReserved { get; set; }
}