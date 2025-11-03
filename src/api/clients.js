import API from "./axios";

export const getClients = (params) => API.get("/api/clients", { params });
export const getClient = (id) => API.get(`/api/clients/${id}`);
export const createClient = (body) => API.post("/api/clients", body);
export const updateClient = (id, body) => API.put(`/api/clients/${id}`, body);
export const deleteClient = (id) => API.delete(`/api/clients/${id}`);
