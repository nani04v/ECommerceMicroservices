import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <header>
      <Link to="/" className="brand">
        🛍️ E-Shop
      </Link>

      <nav>
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        {token && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}

        {user?.role === "Admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {!token ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <span className="user-welcome">
              Hi, {user?.firstName || "User"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;