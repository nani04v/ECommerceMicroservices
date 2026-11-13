const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// ============================================================
// AUTHENTICATION
// ============================================================

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Invalid email or password"
    );
  }

  return await response.json();
}


// ============================================================
// PRODUCTS
// ============================================================

export async function getProducts() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Product`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status}`
    );
  }

  return await response.json();
}


export async function getProductById(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Product/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product: ${response.status}`
    );
  }

  return await response.json();
}


export async function getProductsByCategory(categoryId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Product/category/${categoryId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products by category: ${response.status}`
    );
  }

  return await response.json();
}


// ============================================================
// PRODUCT ADMIN
// ============================================================

export async function createProduct(productData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Failed to create product: ${response.status}`
    );
  }

  return await response.json();
}


export async function updateProduct(productId, productData) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Product/${productId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Failed to update product: ${response.status}`
    );
  }

  if (response.status === 204) {
    return true;
  }

  const text = await response.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
}


export async function deleteProduct(productId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Product/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Failed to delete product: ${response.status}`
    );
  }

  return true;
}


// ============================================================
// PRODUCT EXCEL IMPORT
// ============================================================

export async function importProducts(file) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/Product/import`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to import products: ${response.status}`
    );
  }

  return await response.json();
}


// ============================================================
// ORDERS / CHECKOUT
// ============================================================

export async function checkoutOrder(checkoutData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkoutData),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Checkout failed: ${response.status}`
    );
  }

  return await response.json();
}


export async function getUserOrders(userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Order/user/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch orders: ${response.status}`
    );
  }

  return await response.json();
}


export async function getOrderById(orderId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Order/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch order: ${response.status}`
    );
  }

  return await response.json();
}


// ============================================================
// CATEGORIES
// ============================================================

// NOTE:
// Category APIs are not currently exposed by our ProductService.
// These functions are kept temporarily because the frontend
// already uses them. We will add the missing Category APIs next.

export async function getCategories() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Category`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status}`
    );
  }

  return await response.json();
}


export async function createCategory(categoryData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to create category: ${response.status}`
    );
  }

  const text = await response.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
}


export async function updateCategory(
  categoryId,
  categoryData
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Category/${categoryId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to update category: ${response.status}`
    );
  }

  const text = await response.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
}


export async function deleteCategory(categoryId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Category/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to delete category: ${response.status}`
    );
  }

  return true;
}


// ============================================================
// INVENTORY
// ============================================================

// NOTE:
// Inventory CRUD APIs are not currently exposed by our
// ProductService. These will need to be developed as part
// of the "Develop missing APIs" acceptance criterion.

export async function getInventory() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Inventory`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to fetch inventory: ${response.status}`
    );
  }

  return await response.json();
}


export async function createInventory(inventoryData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/Inventory`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventoryData),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to create inventory: ${response.status}`
    );
  }

  const text = await response.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
}


export async function updateInventory(
  inventoryId,
  inventoryData
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Inventory/${inventoryId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inventoryData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to update inventory: ${response.status}`
    );
  }

  const text = await response.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
}


export async function deleteInventory(inventoryId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/Inventory/${inventoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
        `Failed to delete inventory: ${response.status}`
    );
  }

  return true;
}