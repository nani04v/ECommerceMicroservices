import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <span className="page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage your E-Shop products, categories,
            inventory, and bulk imports.
          </p>
        </div>

        <div className="admin-dashboard-icon">
          ⚙️
        </div>
      </div>

      <div className="admin-dashboard-grid">
        {/* Products */}
        <div className="admin-card">
          <div className="admin-card-icon">
            🛍️
          </div>

          <div className="admin-card-content">
            <span className="admin-card-label">
              PRODUCTS
            </span>

            <h2>Product Management</h2>

            <p>
              Add new products, update existing products,
              and remove products from your store.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="admin-card-button"
          >
            Manage Products →
          </Link>
        </div>

        {/* Categories */}
        <div className="admin-card">
          <div className="admin-card-icon">
            🗂️
          </div>

          <div className="admin-card-content">
            <span className="admin-card-label">
              CATEGORIES
            </span>

            <h2>Category Management</h2>

            <p>
              Create, edit, and delete categories used
              to organize your products.
            </p>
          </div>

          <Link
            to="/admin/categories"
            className="admin-card-button"
          >
            Manage Categories →
          </Link>
        </div>

        {/* Inventory */}
        <div className="admin-card">
          <div className="admin-card-icon">
            📦
          </div>

          <div className="admin-card-content">
            <span className="admin-card-label">
              INVENTORY
            </span>

            <h2>Inventory Management</h2>

            <p>
              Manage available stock, reserved stock,
              and product reorder levels.
            </p>
          </div>

          <Link
            to="/admin/inventory"
            className="admin-card-button"
          >
            Manage Inventory →
          </Link>
        </div>

        {/* Import */}
        <div className="admin-card">
          <div className="admin-card-icon">
            📊
          </div>

          <div className="admin-card-content">
            <span className="admin-card-label">
              BULK IMPORT
            </span>

            <h2>Excel Product Import</h2>

            <p>
              Import multiple products at once using
              an Excel spreadsheet.
            </p>
          </div>

          <Link
            to="/admin/import"
            className="admin-card-button"
          >
            Import Products →
          </Link>
        </div>
      </div>

      <div className="admin-dashboard-info">
        <div className="admin-dashboard-info-icon">
          🔐
        </div>

        <div>
          <strong>Administrator Access</strong>

          <p>
            These management tools are available only
            to authenticated users with the Admin role.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;