import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">
            WELCOME TO E-SHOP
          </span>

          <h1>
            Everything you need,
            <br />
            all in one place.
          </h1>

          <p>
            Discover quality products, add your favourites
            to your cart, and enjoy a simple and convenient
            shopping experience.
          </p>

          <div className="home-actions">
            <Link
              to="/products"
              className="primary-button"
            >
              Shop Products
            </Link>

            <Link
              to="/products"
              className="secondary-button"
            >
              Explore Products
            </Link>
          </div>
        </div>

        <div className="home-visual">
          <span className="shopping-badge">🛍️</span>
          <strong>Happy Shopping!</strong>
        </div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <span>🛒</span>

          <h2>Easy Shopping</h2>

          <p>
            Browse products and add the items you want
            directly to your cart.
          </p>
        </div>

        <div className="feature-card">
          <span>📦</span>

          <h2>Track Your Orders</h2>

          <p>
            View your orders and stay updated with
            real-time order status notifications.
          </p>
        </div>

        <div className="feature-card">
          <span>🔐</span>

          <h2>Secure Access</h2>

          <p>
            Login securely and access your shopping
            account and order history.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;