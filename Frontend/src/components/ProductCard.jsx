import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function ProductCard(props) {
  const { addToCart } = useCart();

  const product = {
    id: props.id,
    name: props.name,
    description: props.description,
    price: props.price
  };

  function handleAddToCart() {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  return (
    <div>
      <Link to={`/products/${product.id}`}>
        <h3>{product.name}</h3>
      </Link>

      <p>{product.description}</p>

      <p>₹{product.price}</p>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;