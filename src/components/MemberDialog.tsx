"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FormData {
  imageUrl: string;
  name: string;
  superior: string;
  farm: string;
  role: string;
  status: string;
  accountStatus: string;
}

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  farms: { id: string; name: string }[];
  status: { name: string }[];
  mode: "create" | "edit";
  isLoading: boolean;
}

export function MemberDialog({
  open,
  onOpenChange,
  onSubmit,
  formData,
  setFormData,
  mode,
  isLoading,
}: MemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar membro" : "Editar membro"}
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={onSubmit} className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="profile">Foto de perfil</Label>
                <Input
                  id="profile"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="Foto de perfil exemplo: https://i.imgur.com/exemplo1.jpg"
                />
              </div>
              {/* Resto dos campos do formulário */}
              <div className="col-span-4">
                <Label htmlFor="name">Usuário</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Usuário"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="Função"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="superior">Responsável</Label>
                <Input
                  id="superior"
                  value={formData.superior}
                  onChange={(e) =>
                    setFormData({ ...formData, superior: e.target.value })
                  }
                  placeholder="Responsável"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="accountStatus">Status da Conta</Label>
                <Select
                  value={formData.accountStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, accountStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desbloqueado">
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                        Desbloqueado
                      </span>
                    </SelectItem>
                    <SelectItem value="Bloqueado">
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                        Bloqueado
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full mt-4 col-span-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create" ? "Adicionando..." : "Salvando..."}
                  </>
                ) : mode === "create" ? (
                  "Adicionar"
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
