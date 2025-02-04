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
    name: "Jean",
  },
  {
    id: "3",
    name: "Lucca",
  },
  {
    id: "4",
    name: "Igor",
  },
    {
    id: "5",
    name: "Vitinho",
  },
    {
    id: "6",
    name: "Ana",
  },
    {
    id: "7",
    name: "Gui",
  },
    {
    id: "7",
    name: "Marcela",
  },
      {
    id: "7",
    name: "Bila",
  },
      {
    id: "7",
    name: "Rita",
  },
];

export const status: Status[] = [
  {
    name: "Pendente",
    color: "bg-purple-500",
    isDefault: true,
  },
  {
    name: "Vender BTC",
    color: "bg-yellow-500",
  },
  {
    name: "Aguardando Missão",
    color: "bg-blue-500",
  },
  {
    name: "SMS",
    color: "bg-red-500",
  },
  {
    name: "CORE",
    color: "bg-red-500",
  },
  {
    name: "Sem ALEO",
    color: "bg-pink-600",
  },
  {
    name: "Sem Missão",
    color: "bg-slate-300",
  },
  {
    name: "Missões Realizadas",
    color: "bg-green-500",
  },

  {
    name: "Review",
    color: "bg-slate-800",
  },
  {
    name: "Gato Preto",
    color: "bg-slate-800",
  },
  {
    name: "Arquivada",
    color: "bg-orange-600",
  },
];
