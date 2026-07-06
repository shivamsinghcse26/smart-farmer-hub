import api from "./Api";

export const fetchSchemes = () => api.get("/api/v1/schemes");
