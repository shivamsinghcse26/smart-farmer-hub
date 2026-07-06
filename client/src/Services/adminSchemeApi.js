import api from "./Api";

export const getAllSchemes = () =>
  api.get("/api/v1/schemes");

export const createScheme = (data) =>
  api.post("/api/v1/schemes", data);

export const deleteScheme = (id) =>
  api.delete(`/api/v1/schemes/${id}`);
