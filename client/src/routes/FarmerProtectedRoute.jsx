import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const FarmerProtectedRoute = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) return <Navigate to="/login" />;

  if (user?.Role !== "farmer") return <Navigate to="/" />;

  return <Outlet />;
};

export default FarmerProtectedRoute;
