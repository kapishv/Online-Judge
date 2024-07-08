import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  const manageAuth = (accessToken) => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const user = decodedToken.UserInfo.username;
      const roles = decodedToken.UserInfo.roles;
      const isAdmin = roles.includes(5150);

      setAuth({
        user,
        accessToken,
        isAuthenticated: true,
        isAdmin,
      });
    } catch (error) {
      console.error("Failed to decode token", error);
      setAuth({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    }
  };

  const logout = async () => {
    try {
      const response = await axios("/logout", {
        withCredentials: true,
      });
      setAuth({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });
      const accessToken = response?.data?.accessToken;
      manageAuth(accessToken);
      return accessToken;
    } catch (error) {
      console.error("Refresh failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, manageAuth, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
