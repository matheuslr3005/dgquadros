export type ServiceId = "escavacao" | "aterro" | "demolicao" | "limpeza" | "locacao" | "transporte" | "compactacao";

export type Service = {
  id: ServiceId;
  title: string;
  text: string;
};

export const SERVICES: readonly Service[] = [
  {
    id: "escavacao",
    title: "Escavação",
    text: "Valas, fundações, cavas e rebaixamento de terreno com escavadeira hidráulica e retroescavadeira.",
  },
  {
    id: "aterro",
    title: "Aterro",
    text: "Terra levada, espalhada e compactada em camadas para a obra nascer sobre uma base firme.",
  },
  {
    id: "demolicao",
    title: "Demolição",
    text: "Derrubada de construções e retirada do entulho com caminhão caçamba, sem deixar sujeira para trás.",
  },
  {
    id: "limpeza",
    title: "Limpeza de terreno",
    text: "Mato, entulho e resíduos fora. O terreno fica livre, nivelado e pronto para construir.",
  },
];

export const QUOTE_OPTIONS: readonly Service[] = [
  ...SERVICES,
  {
    id: "locacao",
    title: "Locação de retroescavadeira",
    text: "Máquina com operador para a sua obra.",
  },
  {
    id: "compactacao",
    title: "Compactação",
    text: "Rolo compactador para base firme.",
  },
  {
    id: "transporte",
    title: "Transporte (caçamba)",
    text: "Terra, entulho e material.",
  },
];
