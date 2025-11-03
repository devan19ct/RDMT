import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, meApi } from "../api/auth";
import { getToken, setToken, clearToken } from "./token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const init = async () => {
      const t = getToken();
      if (!t) { setLoading(false); return; }
      try {
        const res = await meApi();
        setUser(res.data);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const onUnauth = () => logout();
    window.addEventListener("app:unauthorized", onUnauth);
    return () => window.removeEventListener("app:unauthorized", onUnauth);
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const token = res.data?.token ?? (typeof res.data === "string" ? res.data : null);
    if (!token) throw new Error("No token in login response");
    setToken(token);
    const me = await meApi();
    setUser(me.data);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
