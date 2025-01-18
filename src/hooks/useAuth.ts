"use client";

import { useEffect, useState } from "react";

type UserRole = "admin" | "user" | null;

interface AuthUser {
  role: UserRole;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser>({
    role: null,
    isAuthenticated: false,
  });

  // Senha hash para admin (você pode gerar uma mais segura)
  const ADMIN_PASSWORD = "sha256-H4x!K9#mP2$qL5@nR8";

  useEffect(() => {
    // Verificar autenticação ao carregar
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setUser(JSON.parse(storedAuth));
    }
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      const adminUser = { role: "admin" as UserRole, isAuthenticated: true };
      localStorage.setItem("auth", JSON.stringify(adminUser));
      setUser(adminUser);
      window.location.reload();
      return true;
    } else {
      const regularUser = { role: "user" as UserRole, isAuthenticated: true };
      localStorage.setItem("auth", JSON.stringify(regularUser));
      setUser(regularUser);
      window.location.reload();
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser({ role: null, isAuthenticated: false });
    window.location.reload();
  };

  return {
    user,
    login,
    logout,
    isAdmin: user.role === "admin",
    isAuthenticated: user.isAuthenticated,
  };
};
