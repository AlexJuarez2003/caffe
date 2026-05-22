import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/menu" />;

  return children;
};

export default ProtectedRoute;