import API from "./axios";

export const loginApi = (payload) => API.post("/api/auth/login", payload);
export const meApi = () => API.get("/api/me");
