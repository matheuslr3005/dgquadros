export type MachineId = "retroescavadeira" | "escavadeira" | "trator" | "rolo" | "cacamba";

export type FleetItem = {
  id: MachineId;
  name: string;
  short: string;
  tagline: string;
  description: string;
  uses: readonly string[];
  /** Scene scale so every machine has a similar visual footprint on the turntable. */
  scale: number;
  /** Rotation about Y so the machine shows its best angle first. */
  heading: number;
};

export const FLEET: readonly FleetItem[] = [
  {
    id: "retroescavadeira",
    name: "Retroescavadeira",
    short: "Retro",
    tagline: "Locação com operador",
    description:
      "Nosso serviço carro-chefe. Pá carregadeira na frente e braço de escavação atrás: abre vala, carrega e nivela, tudo com a mesma máquina e um operador de confiança.",
    uses: ["Valas e fundações", "Carga de material", "Nivelamento fino", "Obras pequenas e médias"],
    scale: 1.0,
    heading: 0.3,
  },
  {
    id: "escavadeira",
    name: "Escavadeira Hidráulica",
    short: "Escavadeira",
    tagline: "Força e alcance",
    description:
      "Braço longo e giro de 360° para escavar fundo, mover grandes volumes e trabalhar em espaços onde outras máquinas não chegam.",
    uses: ["Escavação profunda", "Demolição", "Abertura de cavas", "Carregamento de caçambas"],
    scale: 0.78,
    heading: 0.2,
  },
  {
    id: "trator",
    name: "Trator de Esteira",
    short: "Trator",
    tagline: "Terra nivelada",
    description:
      "Lâmina frontal e esteiras que não patinam: empurra, espalha e nivela grandes áreas, mesmo em terreno difícil e irregular.",
    uses: ["Terraplanagem", "Limpeza de terreno", "Aterro e nivelamento", "Abertura de acessos"],
    scale: 1.05,
    heading: 0.45,
  },
  {
    id: "rolo",
    name: "Rolo Compactador",
    short: "Rolo",
    tagline: "Base firme",
    description:
      "Compacta o aterro camada por camada para a obra nascer sobre solo firme, sem recalque nem surpresas depois.",
    uses: ["Compactação de aterro", "Base de pisos e pátios", "Estradas internas", "Loteamentos"],
    scale: 1.1,
    heading: 0.5,
  },
  {
    id: "cacamba",
    name: "Caminhões Caçamba",
    short: "Caçamba",
    tagline: "Transporte de ponta a ponta",
    description:
      "Levam e trazem terra, entulho e material. A obra não para esperando a carga, porque a frota é própria.",
    uses: ["Transporte de terra", "Retirada de entulho", "Material para aterro", "Bota-fora"],
    scale: 0.7,
    heading: 0.55,
  },
];
