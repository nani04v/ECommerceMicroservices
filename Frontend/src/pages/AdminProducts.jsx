import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setError("");

      const [productData, categoryData] =
        await Promise.all([
          getProducts(),
          getCategories()
        ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  Promise.all([
    getProducts(),
    getCategories()
  ])
    .then(([productData, categoryData]) => {
      setProducts(productData);
      setCategories(categoryData);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setError(error.message);
      setLoading(false);
    });
}, []);

  function clearForm() {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
  }

  function startEdit(product) {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategoryId(product.categoryId);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const productData = {
      name: name,
      description: description,
      price: Number(price),
      isActive: true,
      categoryId: Number(categoryId)
    };

    try {
      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          productData
        );

        setMessage("Product updated successfully.");
      } else {
        await createProduct(productData);

        setMessage("Product created successfully.");
      }

      clearForm();
      await loadData();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteProduct(productId);

      setMessage("Product deleted successfully.");

      if (editingProduct?.id === productId) {
        clearForm();
      }

      await loadData();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  function getCategoryName(categoryId) {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category
      ? category.name
      : `Category #${categoryId}`;
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="status-card">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Product Management</h1>

          <p>
            Create, update, and manage the products
            available in your E-Shop.
          </p>
        </div>

        <div className="admin-page-stat">
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          <strong>Error</strong>
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="admin-success">
          <strong>Success</strong>
          <p>{message}</p>
        </div>
      )}

      <div className="admin-product-layout">
        {/* Product Form */}
        <section className="admin-form-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              {editingProduct ? "✏️" : "➕"}
            </div>

            <div>
              <h2>
                {editingProduct
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p>
                {editingProduct
                  ? "Update the selected product details."
                  : "Create a new product for your store."}
              </p>
            </div>
          </div>

          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-group">
              <label htmlFor="productName">
                Product Name
              </label>

              <input
                id="productName"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="productDescription">
                Description
              </label>

              <textarea
                id="productDescription"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter product description"
                rows="5"
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="productPrice">
                  Price
                </label>

                <div className="price-input">
                  <span>₹</span>

                  <input
                    id="productPrice"
                    type="number"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="productCategory">
                  Category
                </label>

                <select
                  id="productCategory"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
              >
                {editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Product List */}
        <section className="admin-products-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              🛍️
            </div>

            <div>
              <h2>Products</h2>

              <p>
                All products currently available in the
                system.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="admin-empty-state">
              <div>📦</div>

              <h3>No Products Found</h3>

              <p>
                Add your first product using the form.
              </p>
            </div>
          ) : (
            <div className="admin-products-list">
              {products.map((product) => (
                <div
                  className="admin-product-item"
                  key={product.id}
                >
                  <div className="admin-product-item-icon">
                    🛍️
                  </div>

                  <div className="admin-product-item-details">
                    <div className="admin-product-item-title">
                      <h3>{product.name}</h3>

                      <span
                        className={
                          product.isActive
                            ? "product-active"
                            : "product-inactive"
                        }
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p>
                      {product.description}
                    </p>

                    <div className="admin-product-meta">
                      <strong>
                        ₹{product.price}
                      </strong>

                      <span>
                        {getCategoryName(
                          product.categoryId
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        startEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminProducts;