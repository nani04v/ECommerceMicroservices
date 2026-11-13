import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import { useCart } from "../context/useCart";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="status-card">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="status-card">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>

        <Link to="/products">
          Back to Products
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price
    });

    alert(`${product.name} added to cart!`);
  }

  const isAvailable =
    product.isActive &&
    (!product.inventory ||
      product.inventory.quantityAvailable > 0);

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-details-card">
        <div className="product-details-visual">
          <span>🛍️</span>
        </div>

        <div className="product-details-content">
          <span className="product-details-category">
            {product.category?.name || "Product"}
          </span>

          <h1>{product.name}</h1>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-details-price">
            ₹{product.price}
          </div>

          <div className="product-details-info">
            <div>
              <span>Category</span>
              <strong>
                {product.category?.name || "Not available"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong
                className={
                  product.isActive
                    ? "status-available"
                    : "status-unavailable"
                }
              >
                {product.isActive
                  ? "Available"
                  : "Unavailable"}
              </strong>
            </div>

            {product.inventory && (
              <div>
                <span>Available Stock</span>
                <strong>
                  {product.inventory.quantityAvailable}
                </strong>
              </div>
            )}
          </div>

          <div className="product-details-actions">
            {isAvailable ? (
              <button onClick={handleAddToCart}>
                Add to Cart
              </button>
            ) : (
              <button disabled>
                Out of Stock
              </button>
            )}

            <Link
              to="/cart"
              className="view-cart-button"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;