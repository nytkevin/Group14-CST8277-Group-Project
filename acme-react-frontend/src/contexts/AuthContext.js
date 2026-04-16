import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const token = "Basic " + btoa(username + ":" + password);

      console.log(
        "AuthContext: Attempting login with token:",
        token.substring(0, 20) + "...",
      );

      const response = await axios.get(
        "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1/student",
        {
          headers: {
            Authorization: token,
          },
        },
      );

      console.log(
        "AuthContext: Login successful, response status:",
        response.status,
      );
      localStorage.setItem("auth", token);
      setUser({ token });
      return true;
    } catch (error) {
      console.error("AuthContext: Login failed with error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: "http://localhost:8080/REST-ACMECollege-Skeleton/api/v1/student",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
