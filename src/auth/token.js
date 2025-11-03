const KEY = "bytesymphony_token";

export const setToken = (t) => {
  localStorage.setItem(KEY, t);
};

export const getToken = () => {
  return localStorage.getItem(KEY);
};

export const clearToken = () => {
  localStorage.removeItem(KEY);
};
