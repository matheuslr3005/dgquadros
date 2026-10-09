import { QUOTE_OPTIONS } from "../data/services";
import type { ServiceId } from "../data/services";

export type Deadline = "urgente" | "semana" | "mes" | "pesquisando";

export const DEADLINES: readonly { id: Deadline; label: string; sentence: string }[] = [
  { id: "urgente", label: "Urgente", sentence: "urgente, o quanto antes" },
  { id: "semana", label: "Esta semana", sentence: "para esta semana" },
  { id: "mes", label: "Este mês", sentence: "para este mês" },
  { id: "pesquisando", label: "Só pesquisando", sentence: "ainda estou pesquisando preços" },
];

export type QuoteDraft = {
  services: readonly ServiceId[];
  place: string;
  area: number | null;
  deadline: Deadline | null;
  name: string;
};

const formatList = (items: readonly string[]): string => {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
};

export const buildQuoteMessage = (draft: QuoteDraft, contactName: string): string => {
  const names = draft.services
    .map((id) => QUOTE_OPTIONS.find((option) => option.id === id)?.title.toLowerCase())
    .filter((title): title is string => Boolean(title));
  const deadline = DEADLINES.find((entry) => entry.id === draft.deadline)?.sentence;
  const name = draft.name.trim();
  const place = draft.place.trim();

  const lines = [
    `Olá, ${contactName}! ${name ? `Aqui é ${name}. ` : ""}Vim pelo site da D.G. de Quadros.`,
    "",
    names.length > 0 ? `Preciso de: ${formatList(names)}.` : "Gostaria de um orçamento de terraplanagem.",
    place ? `Local da obra: ${place}.` : "",
    draft.area ? `Terreno de aproximadamente ${draft.area.toLocaleString("pt-BR")} m².` : "",
    deadline ? `Prazo: ${deadline}.` : "",
    "",
    "Pode me passar um orçamento?",
  ];

  return lines
    .filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""))
    .join("\n");
};
