interface Farm {
  id: string;
  name: string;
}

interface Status {
  name: string;
  color: string;
  isDefault?: boolean;
}

export const farms: Farm[] = [
  {
    id: "1",
    name: "Nenhum",
  },
  {
    id: "2",
    name: "Esqueleto",
  },
  {
    id: "3",
    name: "Zumbi",
  },
  {
    id: "4",
    name: "Creeper",
  },
];

export const status: Status[] = [
  {
    name: "Pendente",
    color: "bg-purple-500",
    isDefault: true,
  },
  {
    name: "Vender",
    color: "bg-yellow-500",
  },
  {
    name: "Aguardando Missão",
    color: "bg-blue-500",
  },
  {
    name: "Realizado",
    color: "bg-green-500",
  },
  {
    name: "Review",
    color: "bg-slate-800",
  },
];
