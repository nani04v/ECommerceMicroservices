import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  getProducts,
  getCategories,
  getProductsByCategory
} from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [productData, categoryData] = await Promise.all([
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
    }

    loadData();
  }, []);

  async function handleCategoryChange(categoryId) {
    setSelectedCategory(categoryId);
    setError("");

    try {
      setLoading(true);

      if (categoryId === "all") {
        const data = await getProducts();
        setProducts(data);
      } else {
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="products-header">
        <div>
          <span className="page-eyebrow">OUR STORE</span>

          <h1>Explore Products</h1>

          <p>
            Browse our collection and find something you
            love.
          </p>
        </div>

        <div className="category-filter">
          <label htmlFor="category">
            Filter by Category
          </label>

          <select
            id="category"
            value={selectedCategory}
            onChange={(event) =>
              handleCategoryChange(event.target.value)
            }
          >
            <option value="all">All Products</option>

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

      <div className="products-divider" />

      {loading && (
        <div className="status-card">
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="status-card">
            <h2>No Products Found</h2>

            <p>
              There are no products available in this
              category.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        products.length > 0 && (
          <>
            <div className="products-count">
              {products.length} product
              {products.length !== 1 ? "s" : ""} found
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                />
              ))}
            </div>
          </>
        )}
    </div>
  );
}

export default Products;