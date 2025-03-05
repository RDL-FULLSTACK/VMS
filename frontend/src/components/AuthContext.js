import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // null means not logged in

  const login = (role) => {
    setUserRole(role); // Set role after successful login
  };

  const logout = () => {
    setUserRole(null); // Clear role on logout
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};