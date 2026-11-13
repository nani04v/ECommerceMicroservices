import { useCallback, useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  function clearForm() {
    setEditingCategory(null);
    setName("");
    setDescription("");
  }

  function startEdit(category) {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);

    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const categoryData = {
      name: name,
      description: description,
      isActive: true
    };

    try {
      if (editingCategory) {
        await updateCategory(
          editingCategory.id,
          categoryData
        );

        setMessage("Category updated successfully.");
      } else {
        await createCategory(categoryData);

        setMessage("Category created successfully.");
      }

      clearForm();

      await loadCategories();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteCategory(categoryId);

      setMessage("Category deleted successfully.");

      if (editingCategory?.id === categoryId) {
        clearForm();
      }

      await loadCategories();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="status-card">
          <p>Loading categories...</p>
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

          <h1>Category Management</h1>

          <p>
            Create and manage the categories used to
            organize your E-Shop products.
          </p>
        </div>

        <div className="admin-page-stat">
          <strong>{categories.length}</strong>
          <span>Categories</span>
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

      <div className="admin-category-layout">
        {/* Category Form */}

        <section className="admin-form-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              {editingCategory ? "✏️" : "🗂️"}
            </div>

            <div>
              <h2>
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p>
                {editingCategory
                  ? "Update the selected category."
                  : "Create a new product category."}
              </p>
            </div>
          </div>

          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-group">
              <label htmlFor="categoryName">
                Category Name
              </label>

              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="categoryDescription">
                Description
              </label>

              <textarea
                id="categoryDescription"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter category description"
                rows="6"
                required
              />
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
              >
                {editingCategory
                  ? "Update Category"
                  : "Add Category"}
              </button>

              {editingCategory && (
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

        {/* Category List */}

        <section className="admin-products-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              🗂️
            </div>

            <div>
              <h2>Categories</h2>

              <p>
                All categories currently available in
                the system.
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="admin-empty-state">
              <div>🗂️</div>

              <h3>No Categories Found</h3>

              <p>
                Add your first category using the form.
              </p>
            </div>
          ) : (
            <div className="admin-category-list">
              {categories.map((category) => (
                <div
                  className="admin-category-item"
                  key={category.id}
                >
                  <div className="admin-category-icon">
                    🗂️
                  </div>

                  <div className="admin-category-details">
                    <div className="admin-category-title">
                      <h3>{category.name}</h3>

                      <span
                        className={
                          category.isActive
                            ? "product-active"
                            : "product-inactive"
                        }
                      >
                        {category.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p>
                      {category.description}
                    </p>

                    <span className="admin-category-id">
                      Category ID: {category.id}
                    </span>
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        startEdit(category)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(category.id)
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

export default AdminCategories;