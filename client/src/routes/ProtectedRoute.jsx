import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const BuyerProtectedRoute = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) return <Navigate to="/login" />;

  if (user?.Role !== "buyer") return <Navigate to="/" />;

  return <Outlet />;
};

export default BuyerProtectedRoute;
