"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function LoginDialog() {
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { login, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogin = () => {
    const isAdminLogin = login(password);
    if (isAdminLogin) {
      setIsOpen(false);
    } else {
      alert("Senha incorreta para admin. Logado como usuário regular.");
    }
    setPassword("");
  };

  return (
    <div className="flex gap-2 items-center gap-2">
      {!isAuthenticated ? (
        <Button onClick={() => setIsOpen(true)}>Login</Button>
      ) : (
        <>
          <span className="text-sm">
            {isAdmin ? "Admin" : "Usuário Regular"}
          </span>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Entrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
