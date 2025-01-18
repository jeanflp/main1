"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MemberDialog } from "@/components/MemberDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Header } from "@/components/Header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { farms, status } from "@/constants/data";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowDownUp,
  Eye,
  Loader2,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Member {
  id: string;
  imageUrl: string;
  name: string;
  superior: string;
  farm: string;
  role: string;
  status: "Ativo" | "Inativo" | "Férias";
  accountStatus: "Bloqueado" | "Desbloqueado";
  createdAt: string;
}

interface Warning {
  id: string;
  text: string;
  createdAt: string;
}

export default function Home() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    superior: "",
    farm: "",
    role: "",
    status: "",
    accountStatus: "",
  });
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    create: false,
    delete: "",
    edit: false,
  });
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [warningText, setWarningText] = useState("");
  const [isLoadingWarning, setIsLoadingWarning] = useState({
    create: false,
    delete: "",
  });

  const [isUpdating, setIsUpdating] = useState<{
    farm: string | null;
    status: string | null;
  }>({ farm: null, status: null });

  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredMembers = members.filter((member) => {
    if (!statusFilter) return true;
    return member.status === statusFilter;
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      const membersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[];

      setMembers(membersData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (member: Member) => {
    setFormData({
      imageUrl: member.imageUrl,
      name: member.name,
      superior: member.superior,
      farm: member.farm,
      role: member.role,
      status: member.status,
      accountStatus: member.accountStatus,
    });
    setEditingMember(member.id);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        setIsLoading((prev) => ({ ...prev, edit: true }));
        await updateDoc(doc(db, "members", editingMember), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        setIsLoading((prev) => ({ ...prev, create: true }));
        await addDoc(collection(db, "members"), {
          ...formData,
          status: formData.status || "Pendente",
          accountStatus: formData.accountStatus,
          createdAt: new Date(),
        });
      }

      setOpen(false);
      setFormData({
        imageUrl: "",
        name: "",
        superior: "",
        farm: "",
        role: "",
        status: "",
        accountStatus: "",
      });
      setEditingMember(null);
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, create: false, edit: false }));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading((prev) => ({ ...prev, delete: id }));
      await deleteDoc(doc(db, "members", id));
    } catch (error) {
      console.error("Erro ao deletar membro:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: "" }));
    }
  };

  const handleAddWarning = async () => {
    if (!warningText.trim()) return;

    try {
      setIsLoadingWarning((prev) => ({ ...prev, create: true }));
      await addDoc(collection(db, "warnings"), {
        text: warningText,
        createdAt: new Date().toISOString(),
      });

      setWarningText("");
    } catch (error) {
      console.error("Erro ao adicionar aviso:", error);
    } finally {
      setIsLoadingWarning((prev) => ({ ...prev, create: false }));
    }
  };

  const handleDeleteWarning = async (id: string) => {
    try {
      setIsLoadingWarning((prev) => ({ ...prev, delete: id }));
      await deleteDoc(doc(db, "warnings", id));
    } catch (error) {
      console.error("Erro ao deletar aviso:", error);
    } finally {
      setIsLoadingWarning((prev) => ({ ...prev, delete: "" }));
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "warnings"), (snapshot) => {
      const warningsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Warning[];

      // Ordenar por data de criação, mais recentes primeiro
      warningsData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setWarnings(warningsData);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString: Timestamp | string) => {
    const date =
      dateString instanceof Timestamp
        ? dateString.toDate()
        : new Date(dateString);

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdateMember = async (
    memberId: string,
    field: "farm" | "status",
    value: string
  ) => {
    try {
      setIsUpdating((prev) => ({ ...prev, [field]: memberId }));

      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        [field]: value,
      });

      // Opcional: Atualizar o estado local ou recarregar os dados
      // Você pode querer atualizar sua lista de members aqui
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleUpdateAccountStatus = async (memberId: string, value: string) => {
    try {
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        accountStatus: value,
      });
    } catch (error) {
      console.error("Erro ao atualizar status da conta:", error);
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <Header />

      <div className="flex items-end gap-4 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>+ Adicionar membro</Button>
          </DialogTrigger>
          <MemberDialog
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            farms={farms}
            status={status}
            mode={editingMember ? "edit" : "create"}
            isLoading={isLoading.create || isLoading.edit}
          />
        </Dialog>

        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold uppercase">
            Total: {members.length}
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="col-span-2 overflow-y-scroll max-h-[calc(100vh-40px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Missão</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="flex items-center gap-1">
                  Status
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ArrowDownUp className="w-2 h-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => setStatusFilter(null)}
                        >
                          Todos
                        </Button>
                        {status.map((statusItem) => (
                          <Button
                            key={statusItem.name}
                            variant="ghost"
                            className="justify-start"
                            onClick={() => setStatusFilter(statusItem.name)}
                          >
                            <span className="flex items-center">
                              <span
                                className={`h-2 w-2 rounded-full ${statusItem.color} mr-2`}
                              />
                              {statusItem.name}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <img
                      src={
                        member.imageUrl ||
                        "https://i.pinimg.com/originals/54/f4/b5/54f4b55a59ff9ddf2a2655c7f35e4356.jpg"
                      }
                      alt={`Avatar de ${member.name}`}
                      className="w-10 h-10 rounded-md"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://i.pinimg.com/originals/54/f4/b5/54f4b55a59ff9ddf2a2655c7f35e4356.jpg";
                      }}
                    />
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.superior}</TableCell>
                  <TableCell>
                    <Select
                      value={member.farm}
                      onValueChange={(value) =>
                        handleUpdateMember(member.id.toString(), "farm", value)
                      }
                      disabled={isUpdating.farm === member.id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Farm" />
                      </SelectTrigger>
                      <SelectContent>
                        {farms.map((farm) => (
                          <SelectItem key={farm.id} value={farm.name}>
                            {farm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2">
                        <span>{member.role}</span>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={
                        status.find((s) => s.name === member.status)
                          ? status.find((s) => s.name === member.status)?.name
                          : status.find((s) => s.isDefault)?.name
                      }
                      onValueChange={(value) =>
                        handleUpdateMember(
                          member.id.toString(),
                          "status",
                          value
                        )
                      }
                      disabled={isUpdating.status === member.id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {status.map((statusItem) => (
                          <SelectItem
                            key={statusItem.name}
                            value={statusItem.name}
                          >
                            <span className="flex items-center">
                              <span
                                className={`h-2 w-2 rounded-full ${statusItem.color} mr-2`}
                              />
                              {statusItem.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Select
                        value={member.accountStatus || formData.accountStatus}
                        onValueChange={(value) =>
                          handleUpdateAccountStatus(member.id.toString(), value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status da Conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bloqueado">
                            <span className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              Bloqueado
                            </span>
                          </SelectItem>
                          <SelectItem value="Desbloqueado">
                            <span className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              Desbloqueado
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            member.accountStatus === "Desbloqueado"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } mr-2`}
                        />
                        {member.accountStatus || "Bloqueado"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(member.createdAt)}</TableCell>
                  <TableCell>
                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member.id.toString())}
                          disabled={isLoading.delete === member.id}
                        >
                          {isLoading.delete === member.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2Icon className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(member)}
                          disabled={isLoading.edit}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mural de avisos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {warnings.map((warning) => (
                  <div
                    key={warning.id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-gray-500">{warning.text}</p>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWarning(warning.id)}
                        disabled={isLoadingWarning.delete === warning.id}
                        className="p-2"
                      >
                        {isLoadingWarning.delete === warning.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2Icon className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </ul>
            </CardContent>
            {isAdmin && (
              <CardFooter className="flex flex-col items-start gap-2">
                <Textarea
                  placeholder="Adicione um aviso"
                  value={warningText}
                  onChange={(e) => setWarningText(e.target.value)}
                />
                <Button
                  onClick={handleAddWarning}
                  disabled={isLoadingWarning.create || !warningText.trim()}
                  className="w-full"
                >
                  {isLoadingWarning.create ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    "+ Adicionar aviso"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
