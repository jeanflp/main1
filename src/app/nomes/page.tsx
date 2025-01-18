"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface NameInput {
  id: string;
  value: string;
}

interface StoredName {
  id: string;
  name: string;
  selected: boolean;
}

export default function NomesPage() {
  const { isAdmin } = useAuth();
  const [names, setNames] = useState<NameInput[]>([{ id: "1", value: "" }]);
  const [storedNames, setStoredNames] = useState<StoredName[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    submit: false,
    delete: "",
    update: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "names"), (snapshot) => {
      const namesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StoredName[];

      setStoredNames(namesData);
    });

    return () => unsubscribe();
  }, []);

  const addNewNameInput = () => {
    setNames((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), value: "" },
    ]);
  };

  const removeNameInput = (id: string) => {
    setNames((prev) => prev.filter((name) => name.id !== id));
  };

  const handleNameChange = (id: string, value: string) => {
    setNames((prev) =>
      prev.map((name) => (name.id === id ? { ...name, value } : name))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const validNames = names.filter((name) => name.value.trim() !== "");

      for (const name of validNames) {
        await addDoc(collection(db, "names"), {
          name: name.value,
          selected: false,
        });
      }

      setNames([{ id: "1", value: "" }]);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar nomes:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading((prev) => ({ ...prev, delete: id }));
      await deleteDoc(doc(db, "names", id));
    } catch (error) {
      console.error("Erro ao deletar nome:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: "" }));
    }
  };

  const handleToggleSelect = async (id: string, currentSelected: boolean) => {
    try {
      setIsLoading((prev) => ({ ...prev, update: id }));
      await updateDoc(doc(db, "names", id), {
        selected: !currentSelected,
      });
    } catch (error) {
      console.error("Erro ao atualizar seleção:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, update: "" }));
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Nomes</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-5">+ Adicionar nomes</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar nomes</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {names.map((name, index) => (
                  <div key={name.id} className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={name.id} className="sr-only">
                        Nome {index + 1}
                      </Label>
                      <Input
                        id={name.id}
                        placeholder={`Digite o nome ${index + 1}`}
                        value={name.value}
                        onChange={(e) =>
                          handleNameChange(name.id, e.target.value)
                        }
                      />
                    </div>
                    {names.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNameInput(name.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addNewNameInput}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar outro nome
                </Button>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading.submit}
                >
                  {isLoading.submit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar nomes"
                  )}
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Selecionado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storedNames.map((name) => (
            <TableRow
              key={name.id}
              className={name.selected ? "select-none opacity-50" : ""}
            >
              <TableCell>{name.name}</TableCell>
              <TableCell>
                {isLoading.update === name.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={name.selected}
                    onChange={() => handleToggleSelect(name.id, name.selected)}
                  />
                )}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(name.id)}
                    disabled={isLoading.delete === name.id}
                  >
                    {isLoading.delete === name.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
