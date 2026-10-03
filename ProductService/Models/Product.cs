namespace ProductService.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public bool IsActive { get; set; } = true;

    public int CategoryId { get; set; }

    public Category? Category { get; set; }

    public Inventory? Inventory { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}