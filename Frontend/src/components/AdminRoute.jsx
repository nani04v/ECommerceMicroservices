import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(savedUser);

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;