import api from "../Services/Api";

export const getAdminDashboard = () =>
  api.get("/api/v1/admin/dashboard", { withCredentials: true });

export const getAllUsers = () =>
  api.get("/api/v1/admin/users", { withCredentials: true });

export const getAllCrops = () =>
  api.get("/api/v1/admin/crops", { withCredentials: true });

export const deleteCropByAdmin = (id) =>
  api.delete(`/api/v1/admin/crops/${id}`, { withCredentials: true });

export const toggleBlockUser = (id) =>
  api.put(`/api/v1/admin/users/${id}/block`, {}, { withCredentials: true });

export const getAllFarmersForAdmin = () =>
  api.get("/api/v1/admin/farmers", { withCredentials: true });

export const verifyFarmer = (id, verified) =>
  api.put(
    `/api/v1/admin/farmers/${id}/verify`,
    { verified },
    { withCredentials: true }
  );
