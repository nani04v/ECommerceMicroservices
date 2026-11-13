import { useEffect, useState } from "react";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getProducts
} from "../services/api";

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [quantityReserved, setQuantityReserved] = useState("0");
  const [reorderLevel, setReorderLevel] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      getInventory(),
      getProducts()
    ])
      .then(([inventoryData, productData]) => {
        setInventory(inventoryData);
        setProducts(productData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  async function reloadInventory() {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  function resetForm() {
    setProductId("");
    setQuantityAvailable("");
    setQuantityReserved("0");
    setReorderLevel("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const inventoryData = {
        productId: Number(productId),
        quantityAvailable: Number(quantityAvailable),
        quantityReserved: Number(quantityReserved),
        reorderLevel: Number(reorderLevel)
      };

      if (editingId) {
        await updateInventory(
          editingId,
          inventoryData
        );

        setMessage(
          "Inventory updated successfully."
        );
      } else {
        await createInventory(inventoryData);

        setMessage(
          "Inventory created successfully."
        );
      }

      resetForm();
      await reloadInventory();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setProductId(String(item.productId));
    setQuantityAvailable(
      String(item.quantityAvailable)
    );
    setQuantityReserved(
      String(item.quantityReserved)
    );
    setReorderLevel(
      String(item.reorderLevel)
    );

    setMessage("");
    setError("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteInventory(id);

      setMessage(
        "Inventory deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await reloadInventory();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  function getProductName(productId) {
    const product = products.find(
      (item) => item.id === productId
    );

    return product
      ? product.name
      : `Product #${productId}`;
  }

  function getStockStatus(item) {
    if (item.quantityAvailable === 0) {
      return {
        label: "Out of Stock",
        className: "inventory-danger"
      };
    }

    if (
      item.quantityAvailable <=
      item.reorderLevel
    ) {
      return {
        label: "Low Stock",
        className: "inventory-warning"
      };
    }

    return {
      label: "In Stock",
      className: "inventory-success"
    };
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="status-card">
          <p>Loading inventory...</p>
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

          <h1>Inventory Management</h1>

          <p>
            Manage product stock, reserved quantities,
            and reorder levels.
          </p>
        </div>

        <div className="admin-page-stat">
          <strong>{inventory.length}</strong>
          <span>Records</span>
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

      <div className="admin-inventory-layout">
        {/* Inventory Form */}

        <section className="admin-form-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              {editingId ? "✏️" : "📦"}
            </div>

            <div>
              <h2>
                {editingId
                  ? "Edit Inventory"
                  : "Add Inventory"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected stock record."
                  : "Create an inventory record for a product."}
              </p>
            </div>
          </div>

          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-group">
              <label htmlFor="inventoryProduct">
                Product
              </label>

              <select
                id="inventoryProduct"
                value={productId}
                onChange={(event) =>
                  setProductId(event.target.value)
                }
                required
              >
                <option value="">
                  Select Product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="quantityAvailable">
                Available Quantity
              </label>

              <input
                id="quantityAvailable"
                type="number"
                min="0"
                value={quantityAvailable}
                onChange={(event) =>
                  setQuantityAvailable(
                    event.target.value
                  )
                }
                placeholder="Enter available quantity"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="quantityReserved">
                Reserved Quantity
              </label>

              <input
                id="quantityReserved"
                type="number"
                min="0"
                value={quantityReserved}
                onChange={(event) =>
                  setQuantityReserved(
                    event.target.value
                  )
                }
                placeholder="Enter reserved quantity"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="reorderLevel">
                Reorder Level
              </label>

              <input
                id="reorderLevel"
                type="number"
                min="0"
                value={reorderLevel}
                onChange={(event) =>
                  setReorderLevel(
                    event.target.value
                  )
                }
                placeholder="Enter reorder level"
                required
              />
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
              >
                {editingId
                  ? "Update Inventory"
                  : "Add Inventory"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Inventory List */}

        <section className="admin-products-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              📦
            </div>

            <div>
              <h2>Inventory Records</h2>

              <p>
                Current stock levels for your products.
              </p>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="admin-empty-state">
              <div>📦</div>

              <h3>No Inventory Records</h3>

              <p>
                Add an inventory record using the form.
              </p>
            </div>
          ) : (
            <div className="admin-inventory-list">
              {inventory.map((item) => {
                const stockStatus =
                  getStockStatus(item);

                return (
                  <div
                    className="admin-inventory-item"
                    key={item.id}
                  >
                    <div className="inventory-product-icon">
                      📦
                    </div>

                    <div className="inventory-details">
                      <div className="inventory-title">
                        <h3>
                          {getProductName(
                            item.productId
                          )}
                        </h3>

                        <span
                          className={
                            stockStatus.className
                          }
                        >
                          {stockStatus.label}
                        </span>
                      </div>

                      <div className="inventory-stats">
                        <div>
                          <span>Available</span>
                          <strong>
                            {item.quantityAvailable}
                          </strong>
                        </div>

                        <div>
                          <span>Reserved</span>
                          <strong>
                            {item.quantityReserved}
                          </strong>
                        </div>

                        <div>
                          <span>Reorder Level</span>
                          <strong>
                            {item.reorderLevel}
                          </strong>
                        </div>
                      </div>

                      <p className="inventory-updated">
                        Last updated:{" "}
                        {item.updatedAt
                          ? new Date(
                              item.updatedAt
                            ).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminInventory;