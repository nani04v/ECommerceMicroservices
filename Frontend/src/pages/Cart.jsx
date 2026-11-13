import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>

        <h1>Your Cart is Empty</h1>

        <p>
          You haven't added anything to your cart yet.
          Explore our products and find something you love.
        </p>

        <Link
          to="/products"
          className="continue-shopping-button"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <div>
          <span className="page-eyebrow">YOUR SHOPPING CART</span>

          <h1>Shopping Cart</h1>

          <p>
            Review your items before proceeding to checkout.
          </p>
        </div>

        <Link
          to="/products"
          className="continue-shopping-link"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-icon">
                🛍️
              </div>

              <div className="cart-item-details">
                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <span className="cart-item-price">
                  ₹{item.price}
                </span>
              </div>

              <div className="cart-item-controls">
                <span className="quantity-label">
                  Quantity
                </span>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>
                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  type="button"
                  className="remove-cart-button"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            type="button"
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;