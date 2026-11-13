import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { checkoutOrder } from "../services/api";

function Checkout() {
  const { cartItems, clearCart } = useCart();

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleCheckout(event) {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setError("Please login before checkout.");
      return;
    }

    const user = JSON.parse(savedUser);

    const checkoutData = {
      userId: user.id,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,

      // OrderService expects OrderItems
      orderItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      setLoading(true);

      const result = await checkoutOrder(checkoutData);

      console.log("Checkout result:", result);

      clearCart();

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>

        <h1>Your Cart is Empty</h1>

        <p>
          Add some products to your cart before proceeding
          to checkout.
        </p>

        <button
          type="button"
          className="continue-shopping-button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page-header">
        <div>
          <span className="page-eyebrow">
            COMPLETE YOUR PURCHASE
          </span>

          <h1>Checkout</h1>

          <p>
            Enter your delivery details and confirm your order.
          </p>
        </div>

        <button
          type="button"
          className="continue-shopping-link"
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
        </button>
      </div>

      <div className="checkout-layout">

        {/* Order Summary */}
        <section className="checkout-summary">
          <div className="checkout-section-header">
            <span className="checkout-section-icon">
              🛒
            </span>

            <div>
              <h2>Order Summary</h2>

              <p>
                {cartItems.length} item
                {cartItems.length !== 1 ? "s" : ""} in your order
              </p>
            </div>
          </div>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >
                <div className="checkout-item-icon">
                  🛍️
                </div>

                <div className="checkout-item-details">
                  <h3>{item.name}</h3>

                  <p>
                    Quantity: {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ₹{total}
            </strong>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="checkout-form-card">
          <div className="checkout-section-header">
            <span className="checkout-section-icon">
              📦
            </span>

            <div>
              <h2>Delivery Details</h2>

              <p>
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckout}>

            <div className="form-group">
              <label htmlFor="shippingAddress">
                Shipping Address
              </label>

              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(event) =>
                  setShippingAddress(event.target.value)
                }
                placeholder="Enter your complete shipping address"
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">
                Payment Method
              </label>

              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              >
                <option value="Mock">
                  Mock Payment
                </option>
              </select>

              <small className="form-help">
                This project currently uses a mock payment
                method for testing.
              </small>
            </div>

            {error && (
              <div className="checkout-error">
                <strong>Checkout failed</strong>

                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="checkout-place-order-button"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : `Place Order • ₹${total}`}
            </button>

          </form>
        </section>

      </div>
    </div>
  );
}

export default Checkout;