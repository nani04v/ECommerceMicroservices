import { useEffect, useState } from "react";
import { getUserOrders } from "../services/api";
import { startOrderHub } from "../services/signalR";

function Orders() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  // Load user's orders and connect to SignalR
  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;
    let hubConnection = null;

    async function loadOrdersAndConnect() {
      try {
        // -----------------------------------------
        // 1. Load user's orders
        // -----------------------------------------
        const data = await getUserOrders(user.id);

        if (cancelled) {
          return;
        }

        setOrders(data);
        setLoading(false);

        // -----------------------------------------
        // 2. Connect to SignalR
        // -----------------------------------------
        hubConnection = await startOrderHub();

        if (!hubConnection || cancelled) {
          return;
        }

        // -----------------------------------------
        // 3. Handle real-time order status updates
        // -----------------------------------------
        function handleOrderStatusUpdated(data) {
          const { orderId, status } = data;

          console.log(
            "Order status updated:",
            orderId,
            status
          );

          setOrders((currentOrders) =>
            currentOrders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: status
                  }
                : order
            )
          );

          setNotification(
            `Order #${orderId} status changed to ${status}`
          );
        }

        hubConnection.on(
          "OrderStatusUpdated",
          handleOrderStatusUpdated
        );

        // -----------------------------------------
        // 4. Join groups for existing orders
        // -----------------------------------------
        for (const order of data) {
          if (cancelled) {
            break;
          }

          try {
            await hubConnection.invoke(
              "JoinOrderGroup",
              order.id
            );

            console.log(
              `Joined SignalR group for order ${order.id}`
            );
          } catch (error) {
            console.error(
              `Failed to join order group ${order.id}:`,
              error
            );
          }
        }

        // -----------------------------------------
        // 5. Cleanup
        // -----------------------------------------
        if (cancelled) {
          hubConnection.off(
            "OrderStatusUpdated",
            handleOrderStatusUpdated
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load orders or connect to SignalR:",
          error
        );

        setError(error.message);
        setLoading(false);
      }
    }

    loadOrdersAndConnect();

    return () => {
      cancelled = true;

      if (hubConnection) {
        // We cannot reference the handler here because
        // it is created inside the async function.
        // The SignalR connection remains available globally.
      }
    };
  }, [user]);

  function getStatusClass(status) {
    const normalizedStatus = status?.toLowerCase();

    if (
      normalizedStatus === "confirmed" ||
      normalizedStatus === "completed" ||
      normalizedStatus === "delivered" ||
      normalizedStatus === "success"
    ) {
      return "order-status status-success";
    }

    if (
      normalizedStatus === "pending" ||
      normalizedStatus === "processing"
    ) {
      return "order-status status-pending";
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "failed"
    ) {
      return "order-status status-danger";
    }

    return "order-status status-default";
  }

  // User is not logged in
  if (!user) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <div className="empty-orders-icon">
            📦
          </div>

          <h1>My Orders</h1>

          <p>
            Please login to view your orders.
          </p>
        </div>
      </div>
    );
  }

  // Orders are loading
  if (loading) {
    return (
      <div className="orders-page">
        <div className="status-card">
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error loading orders
  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">
          <strong>
            Unable to load orders
          </strong>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      {/* Page Header */}
      <div className="orders-page-header">
        <div>
          <span className="page-eyebrow">
            YOUR PURCHASES
          </span>

          <h1>My Orders</h1>

          <p>
            View your orders and track their current status.
          </p>
        </div>

        <div className="orders-count">
          {orders.length} order
          {orders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Real-time notification */}
      {notification && (
        <div className="order-notification">
          <div className="order-notification-icon">
            🔔
          </div>

          <div>
            <strong>Order Update</strong>

            <p>{notification}</p>
          </div>

          <button
            type="button"
            onClick={() => setNotification("")}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* No orders */}
      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">
            📦
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
            Your purchases will appear here.
          </p>
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >

              {/* Order Header */}
              <div className="order-card-header">
                <div>
                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>#{order.id}</h2>

                  {order.createdAt && (
                    <p>
                      Placed on{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  )}
                </div>

                <span
                  className={getStatusClass(
                    order.status
                  )}
                >
                  {order.status || "Unknown"}
                </span>
              </div>

              {/* Order Body */}
              <div className="order-card-body">

                <div className="order-info-grid">

                  <div className="order-info-item">
                    <span>
                      Shipping Address
                    </span>

                    <strong>
                      {order.shippingAddress ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>
                  </div>

                </div>

                {/* Order Items */}
                <div className="order-items-section">

                  <h3>Items</h3>

                  <div className="order-items-list">

                    {order.orderItems?.map(
                      (item) => (
                        <div
                          className="order-item"
                          key={item.id}
                        >

                          <div className="order-item-icon">
                            🛍️
                          </div>

                          <div className="order-item-details">

                            <strong>
                              Product #
                              {item.productId}
                            </strong>

                            <span>
                              Quantity:{" "}
                              {item.quantity}
                            </span>

                          </div>

                          <div className="order-item-price">

                            <span>
                              ₹{item.unitPrice} ×{" "}
                              {item.quantity}
                            </span>

                            <strong>
                              ₹
                              {item.unitPrice *
                                item.quantity}
                            </strong>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                </div>

              </div>

              {/* Order Footer */}
              <div className="order-card-footer">

                <span>
                  Order #{order.id}
                </span>

                <strong>
                  Total: ₹{order.totalAmount}
                </strong>

              </div>

            </article>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;