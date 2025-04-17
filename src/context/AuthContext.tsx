import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  admin: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [admin, setAdmin] = useState(() => {
    return localStorage.getItem("admin") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    localStorage.setItem("admin", String(admin));
  }, [isAuthenticated, admin]);

  const login = () => {
    setIsAuthenticated(true);
    setAdmin(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdmin(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
