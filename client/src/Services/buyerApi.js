import api from "../Services/Api";

// ✅ Profile
export const setBuyerProfile = (payload) =>
  api.post("/api/v1/buyers/profile", payload, { withCredentials: true });

export const getBuyerProfile = () =>
  api.get("/api/v1/buyers/profile", { withCredentials: true });

// ✅ Dashboard
export const getBuyerDashboard = () =>
  api.get("/api/v1/buyers/dashboard", { withCredentials: true });

// ✅ Marketplace
export const getMarketplaceCrops = (params) =>
  api.get("/api/v1/buyers/marketplace", {
    withCredentials: true,
    params,
  });

// ✅ Crop Details
export const getCropDetailsForBuyer = (id) =>
  api.get(`/api/v1/buyers/marketplace/${id}`, { withCredentials: true });

// ✅ Place Order ✅ (IMPORTANT)
export const placeOrder = (payload) =>
  api.post("/api/v1/order/place", payload, { withCredentials: true });
