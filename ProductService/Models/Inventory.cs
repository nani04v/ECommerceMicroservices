using ProductService.Models;
using System.Text.Json.Serialization;

public class Inventory
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int QuantityAvailable { get; set; }

    public int QuantityReserved { get; set; }

    public int ReorderLevel { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public Product? Product { get; set; }

}