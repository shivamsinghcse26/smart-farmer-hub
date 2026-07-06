// src/context/Authcontext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../Services/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

 //login
  const loginUser = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setIsLoggedIn(true);
  };

//logout
  const logoutUser = async () => {
    try {
      await api.post("/api/v1/users/logout");
    } catch (err) {
      console.log("Logout error:", err.message);
    }

    setUser(null);
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  //REFRESH ACCESS TOKEN
  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/api/v1/auth/refresh-token");
      const newToken = res.data.data.accessToken;
      setAccessToken(newToken);
      setIsLoggedIn(true);

      return newToken;
    } catch (err) {
      setAccessToken(null);
      setIsLoggedIn(false);
      return null;
    }
  };

  // FETCH USER ON APP LOAD
const fetchCurrentUser = async () => {
  try {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      setLoading(false);
      return;
    }

    const res = await api.get("/api/v1/auth/me");

    setUser(res.data.data);
    setIsLoggedIn(true);
    setLoading(true)
  } catch (err) {
    setUser(null);
    setIsLoggedIn(false);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ===============================
  // ✅ AXIOS INTERCEPTORS
  // ===============================
  useEffect(() => {
    // 🔹 Request Interceptor (Attach Access Token)
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      }
    );

    // 🔹 Response Interceptor (Handle 401 + Refresh)
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 🚨 Prevent infinite loop
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== "/api/v1/auth/refresh-token"
        ) {
          originalRequest._retry = true;

          const newToken = await refreshAccessToken();

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            logoutUser();
          }
        }

        return Promise.reject(error);
      }
    );

    // 🔹 Cleanup
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);